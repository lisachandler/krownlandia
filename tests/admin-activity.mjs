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
