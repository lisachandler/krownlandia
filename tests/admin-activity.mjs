import assert from 'node:assert/strict';
import {activityResponse} from '../server-app/activity-log.mjs';
const env={KROWNLANDIA_ADMIN_EMAIL:'admin@example.test'},records=[{version:1,time:'2026-10-28T01:00:00Z',actor:'Unknown',activity:'Site publication',outcome:'succeeded',commit:'abc1234567890',evidence:'Sites deployment record',deploymentId:'example'}];
const req=(query='',headers={})=>new Request('https://example.test/admin/activity'+query,{headers});
const admin={'oai-authenticated-user-id':'site-user','oai-authenticated-user-email':'admin@example.test'};
for(const query of ['', '?format=csv']){
 assert.equal(activityResponse(req(query),env,records).status,401);
 assert.equal(activityResponse(req(query,{'oai-authenticated-user-email':'admin@example.test'}),env,records).status,401);
 assert.equal(activityResponse(req(query,{...admin,'oai-authenticated-user-email':'viewer@example.test'}),env,records).status,403);
 assert.equal(activityResponse(req(query,admin),{},records).status,403);
}
let r=activityResponse(req('',admin),env,records);assert.equal(r.status,200);assert.equal(r.headers.get('Cache-Control'),'private, no-store');assert((await r.text()).includes('Visitor tracking is off'));
r=activityResponse(req('?from=2026-10-28',admin),env,records);assert((await r.text()).includes('0 matching records'),'filter uses Pacific date, not UTC');
r=activityResponse(req('?from=2026-10-27&to=2026-10-27&format=csv',admin),env,records);assert((await r.text()).includes('abc1234567890'));
for(const q of ['?from=2026-02-30','?from=bad','?from=2026-10-29&to=2026-10-28'])assert.equal(activityResponse(req(q,admin),env,records).status,400);
const hostile=[{...records[0],actor:'<script>alert(1)</script>',activity:'=1+1'}];
assert(!(await activityResponse(req('',admin),env,hostile).text()).includes('<script>'));
assert((await activityResponse(req('?format=csv',admin),env,hostile).text()).includes("'=1+1"));
console.log('PASS: admin authorization for HTML/CSV, fail-closed configuration, private caching, Pacific dates, invalid ranges, HTML escaping and spreadsheet formula safety.');
const searchable=[{...records[0],version:222,summary:'Protected admin activity log and CSV export',summaryEvidence:'Project notes'}, {...records[0],version:221,time:'2026-10-28T15:37:00Z',commit:'def1234567890',summary:'Ready rewards filter for discovery walks',summaryEvidence:'Project notes'}];
let html=await activityResponse(req('?q=READY+walks',admin),env,searchable).text();assert(html.includes('1 matching records'));assert(html.includes('Ready rewards filter'));assert(!html.includes('Protected admin activity log'));assert(html.includes('q=READY+walks'));
html=await activityResponse(req('?q=222',admin),env,searchable).text();assert(html.includes('Protected admin activity log'));assert(!html.includes('Ready rewards filter'));
html=await activityResponse(req('?q=def123',admin),env,searchable).text();assert(html.includes('Ready rewards filter'));
html=await activityResponse(req('?q=ready&to=2026-10-27',admin),env,searchable).text();assert(html.includes('0 matching records'));assert(html.includes('Try fewer search words'));
let csv=await activityResponse(req('?q=ready&format=csv',admin),env,searchable).text();assert(csv.includes('Ready rewards filter'));assert(csv.includes('Change summary'));assert(csv.includes('Project notes'));assert(!csv.includes('Protected admin activity log'));
html=await activityResponse(req('?q='+encodeURIComponent('\"/><script>bad()</script>'),admin),env,searchable).text();assert(!html.includes('<script>'));assert(html.includes('&lt;script&gt;'));
html=await activityResponse(req('?q='+('a'.repeat(200)),admin),env,searchable).text();assert(html.includes('value="'+'a'.repeat(160)+'"'));assert(!html.includes('a'.repeat(161)));
assert.equal(activityResponse(req('?q=ready&format=csv'),env,searchable).status,401);
assert.equal(activityResponse(req('?q=ready',{...admin,'oai-authenticated-user-email':'viewer@example.test'}),env,searchable).status,403);
assert((await activityResponse(req('',admin),env,[]).text()).includes('no imported history yet'));
console.log('PASS: change summaries, case-insensitive multiword search, version/revision lookup, combined dates, matching CSV, escaped/bounded queries, empty history and protected search.');
const detailed=[{...searchable[0],deploymentId:'deployment-evidence-one'}, {...searchable[1],deploymentId:'deployment-evidence-two'}];
html=await activityResponse(req('',admin),env,detailed).text();
assert.equal((html.match(/<details>/g)||[]).length,2);assert(!/<details\s+open/.test(html));
for(const record of detailed){assert(html.includes('aria-label="Publication evidence for version '+record.version+'"'));assert(html.includes(record.commit));assert(html.includes(record.deploymentId));assert(html.includes(record.time));}
assert(html.includes('Hosting record updated (UTC)'));assert(html.includes('does not identify who performed'));
html=await activityResponse(req('?q=deployment-evidence-two',admin),env,detailed).text();assert(html.includes('1 matching records'));assert(html.includes('Version 221'));assert(!html.includes('Version 222'));
csv=await activityResponse(req('?q=deployment-evidence-two&format=csv',admin),env,detailed).text();assert(csv.includes('deployment-evidence-two'));assert(!csv.includes('deployment-evidence-one'));
html=await activityResponse(req('',admin),env,[{...records[0],commit:'<svg onload=bad()>',deploymentId:'<img src=x>',evidence:'<script>bad()</script>'}]).text();assert(!html.includes('<svg'));assert(!html.includes('<img'));assert(!html.includes('<script>'));assert(html.includes('No summary source recorded'));
for(const headers of [{},{...admin,'oai-authenticated-user-email':'viewer@example.test'}]){html=await activityResponse(req('',headers),env,detailed).text();assert(!html.includes('deployment-evidence-one'));assert(!html.includes('abc1234567890'));}
console.log('PASS: collapsed publication evidence, unique accessible names, full revisions/timestamps, provenance fallback, record-ID search/export, escaped fields and unauthorized non-disclosure.');

html=await activityResponse(req('',admin),env,detailed).text();
const scope=html.match(/<details class="log-scope">([\s\S]*?)<\/details>/);
assert(scope,'log scope is an initially collapsed native disclosure');
assert(scope[1].includes('<summary>What this log includes</summary>'));
assert(scope[1].includes('private conversations'));assert(scope[1].includes('Actor identity is unknown'));
const visibleNotice=html.slice(html.indexOf('<div class="note">'),html.indexOf('<details class="log-scope">'));
assert(visibleNotice.includes('Visitor tracking is off'));assert(visibleNotice.includes('through version 222'));assert(visibleNotice.includes('Records are not live'));
assert(html.includes('.table:focus-visible'));assert(html.includes('role="region" aria-label="Build publication records"'));
assert(!(await activityResponse(req('',{}),env,detailed).text()).includes('What this log includes'));
console.log('PASS: compact log scope keeps tracking and snapshot limits visible, with optional detail and keyboard region focus.');
