import {cpSync,mkdirSync,readdirSync,rmSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
const project=new URL('../',import.meta.url).pathname;
const server=project+'server-app/';
rmSync(server+'public',{recursive:true,force:true});mkdirSync(server+'public',{recursive:true});
for(const f of readdirSync(project+'dist'))if(!['server','client','.openai'].includes(f))cpSync(project+'dist/'+f,server+'public/'+f,{recursive:true});
// Only clear generated framework output; retain the last successful published output until build succeeds.
rmSync(server+'dist',{recursive:true,force:true});
const result=spawnSync(process.execPath,['scripts/run-framework.mjs','build'],{cwd:server,stdio:'inherit'});
if(result.status!==0)process.exit(result.status||1);
for(const dir of ['server','client']){rmSync(project+'dist/'+dir,{recursive:true,force:true});cpSync(server+'dist/'+dir,project+'dist/'+dir,{recursive:true});}

for(const dir of ['server','client']){const actual=readdirSync(project+'dist/'+dir,{recursive:true}).sort(),expected=readdirSync(server+'dist/'+dir,{recursive:true}).sort();if(JSON.stringify(actual)!==JSON.stringify(expected))throw Error('Generated '+dir+' output differs from fresh build');console.log('Verified fresh '+dir+' output: '+actual.length+' entries');}
