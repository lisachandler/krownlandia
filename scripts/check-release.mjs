import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
export const CORE_CHECKS = [
  ['Saved visits', 'tests/visit.mjs'],
  ['Backup compatibility and rollback', 'tests/backup.mjs'],
  ['Reward eligibility', 'tests/rewards.mjs'],
  ['Reward history and time boundaries', 'tests/reward-history.mjs'],
  ['Deterministic gameplay walkthrough', 'tests/smoke.mjs'],
  ['Walking routes and unchanged progress', 'tests/walk-routes.mjs'],
  ['Administrator authorization and exports', 'tests/admin-activity.mjs'],
];

// Each suite owns its globals; separate processes prevent fixture leakage.
export function runChecks(checks, {cwd = root, timeout = 600000, log = console.log} = {}) {
  let passed = 0;
  const started = Date.now();
  for (const [label, file] of checks) {
    log(`\n[${passed + 1}/${checks.length}] ${label}`);
    const suiteStarted = Date.now();
    const result = spawnSync(process.execPath, [file], {
      cwd, stdio: 'inherit', timeout, killSignal: 'SIGKILL', shell: false,
    });
    if (result.error || result.signal || result.status !== 0) {
      const reason = result.error?.code === 'ETIMEDOUT' ? `timed out after ${timeout} ms`
        : result.error?.message || (result.signal ? `terminated by ${result.signal}` : `exit ${result.status}`);
      log(`FAIL: ${label} (${reason}). ${passed}/${checks.length} suites passed; remaining suites were not run. Do not publish.`);
      return 1;
    }
    passed++;
    log(`Completed ${label} in ${((Date.now() - suiteStarted) / 1000).toFixed(1)}s.`);
  }
  log(`\nPASS: ${passed}/${checks.length} selected suites completed in ${((Date.now() - started) / 1000).toFixed(1)}s.`);
  log('LIMIT: deterministic checks do not verify WebGL rendering, real media encoding, screen readers, device performance or live multi-user behavior.');
  return 0;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.length > 1 || (args.length === 1 && args[0] !== '--with-artifact')) {
    console.error('Usage: node scripts/check-release.mjs [--with-artifact]\nBuild first before --with-artifact.');
    process.exitCode = 2;
  } else {
    const checks = [...CORE_CHECKS];
    if (args.includes('--with-artifact')) checks.push(['Built Worker and visitor assets', 'tests/admin-artifact.mjs']);
    else console.log('Source checks only. Built Worker verification requires a fresh build and --with-artifact.');
    process.exitCode = runChecks(checks);
  }
}
