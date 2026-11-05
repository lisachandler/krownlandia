import assert from 'node:assert/strict';
import {mkdtempSync, writeFileSync, existsSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {runChecks} from '../scripts/check-release.mjs';
const cwd = mkdtempSync(join(tmpdir(), 'krownlandia-release-'));
try {
  writeFileSync(join(cwd, 'pass.mjs'), 'process.exit(0);');
  writeFileSync(join(cwd, 'fail.mjs'), 'process.exit(7);');
  writeFileSync(join(cwd, 'hang.mjs'), 'setInterval(()=>{},1000);');
  writeFileSync(join(cwd, 'after.mjs'), "import{writeFileSync}from'node:fs';writeFileSync('unexpected','ran');");
  const logs = [], options = {cwd, log: text => logs.push(text)};
  assert.equal(runChecks([['pass','pass.mjs']], options), 0);
  assert(logs.some(x => x.includes('LIMIT:')));
  logs.length = 0;
  assert.equal(runChecks([['failure','fail.mjs'],['must not run','after.mjs']], options), 1);
  assert(!existsSync(join(cwd, 'unexpected')));
  assert(logs.some(x => x.includes('exit 7') && x.includes('0/2')));
  logs.length = 0;
  assert.equal(runChecks([['timeout','hang.mjs'],['must not run','after.mjs']], {...options, timeout: 100}), 1);
  assert(!existsSync(join(cwd, 'unexpected')));
  assert(logs.some(x => x.includes('timed out')));
  const invalid = spawnSync(process.execPath, [new URL('../scripts/check-release.mjs', import.meta.url).pathname, '--unknown'], {cwd});
  assert.equal(invalid.status, 2);
  console.log('PASS: release runner reports success limits, stops after failure/timeout, skips later suites and rejects unknown options.');
} finally { rmSync(cwd, {recursive:true, force:true}); }
