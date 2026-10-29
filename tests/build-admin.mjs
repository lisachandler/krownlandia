import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,existsSync,rmSync,cpSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
const root=mkdtempSync(join(tmpdir(),'krownlandia-build-'));
const put=(path,text)=>{mkdirSync(join(root,path,'..'),{recursive:true});writeFileSync(join(root,path),text);};
try{
 put('dist/index.html','original park');put('dist/vendor/example.js','original vendor');
 put('dist/server/old.js','last good server');put('dist/client/old.js','last good client');
 put('server-app/dist/server/stale.js','obsolete server');put('server-app/dist/client/stale.js','obsolete asset');
 put('server-app/public/stale.txt','obsolete public asset');put('server-app/keep.txt','authored server source');
 mkdirSync(join(root,'scripts'));cpSync(new URL('../scripts/build-admin.mjs',import.meta.url),join(root,'scripts/build-admin.mjs'));
 put('server-app/scripts/run-framework.mjs',`import {existsSync,mkdirSync,writeFileSync,readFileSync,cpSync} from 'node:fs';
 if(existsSync('dist'))throw Error('stale framework output remains');
 if(existsSync('public/stale.txt')||existsSync('public/server'))throw Error('public staging is polluted');
 if(readFileSync('public/index.html','utf8')!=='original park')throw Error('park asset missing');
 if(existsSync('fail'))process.exit(7);
 mkdirSync('dist/server',{recursive:true});mkdirSync('dist/client',{recursive:true});
 writeFileSync('dist/server/index.js','new server');cpSync('public','dist/client',{recursive:true});`);
 const run=()=>spawnSync(process.execPath,[join(root,'scripts/build-admin.mjs')],{encoding:'utf8'});
 let r=run();assert.equal(r.status,0,r.stderr);assert(!existsSync(join(root,'dist/server/old.js')));assert(!existsSync(join(root,'dist/client/stale.js')));assert.equal(readFileSync(join(root,'dist/client/index.html'),'utf8'),'original park');
 r=run();assert.equal(r.status,0,r.stderr);assert.equal(readFileSync(join(root,'dist/vendor/example.js'),'utf8'),'original vendor');assert.equal(readFileSync(join(root,'server-app/keep.txt'),'utf8'),'authored server source');
 put('server-app/fail','yes');r=run();assert.equal(r.status,7);assert.equal(readFileSync(join(root,'dist/server/index.js'),'utf8'),'new server');assert.equal(readFileSync(join(root,'dist/client/index.html'),'utf8'),'original park');
 console.log('PASS: clean repeated builds remove obsolete outputs, retain authored assets and keep the last successful artifact on build failure.');
}finally{rmSync(root,{recursive:true,force:true});}
