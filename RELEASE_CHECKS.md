# Repeatable release checks

From the project root, run `node scripts/check-release.mjs` for seven selected source suites covering saved visits, backups/rollback, reward eligibility and history, a deterministic gameplay walkthrough, walking routes and administrator authorization/export. Suites run in isolated processes and stop on the first failure or ten-minute per-suite timeout. A nonzero exit blocks publication. Unknown arguments fail before tests run.

For a Site release, prepare server dependencies through the Sites installer if missing, then run:

```sh
node scripts/build-admin.mjs
node scripts/check-release.mjs --with-artifact
```

The second command adds built-Worker checks: original assets and visitor reports are served unchanged, administrator HTML/CSV are protected, and private records are not static assets. Wait for process exit, not merely a printed PASS. The command does not build, publish or change sharing. A missing/stale artifact is not a valid release; always build from the exact final source first.

This is a curated baseline, not every test in the repository. Some scene suites import shared scenario checks. Add relevant feature-specific suites when changing their behavior, and run `node tests/release-runner.mjs` when editing the runner. Do not repeat already-passing checks unless final inputs changed or an unresolved concern warrants it.

Continue the normal Sites packaging workflow after success. Compare the packaged generated server/client output with the fresh framework build, including file lists and bytes, before saving/deploying. The runner alone does not certify a later archive or remote deployment.

These tests use simulated browser/renderer behavior. They do not verify real WebGL rendering, codecs, assistive technology, GPU performance or simultaneous visitors. Browser-review work remains paused. Report the selected suite count and these limits; never describe this command as a live visual review or full test-suite pass.
