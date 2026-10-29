# Administrator activity log

`/admin/activity` is a server-rendered, read-only build-publication log. It is not visitor analytics or a complete audit trail. Visitor tracking remains off; browser progress and backups are unchanged.

The server requires both platform-injected identity headers and a matching `KROWNLANDIA_ADMIN_EMAIL` runtime setting. This setting is managed in Sites, never in browser assets or GitHub. Missing configuration denies access. HTML and CSV require the same authorization and use private/no-store responses. Ordinary Site viewers are not administrators. This initial explicit email allowlist must be updated by the owner if the administrator's account changes; it does not automatically follow Site roles.

Records live in server-only `server-app/build-history.json`, imported from confirmed Sites deployment records. They are a publication-time snapshot, not a live query, immutable audit system, or proof of who performed an action. Preserve unknown actors rather than guessing. Dates filter in Pacific Time; CSV retains UTC timestamps and complete source revisions. The UI and export never need private visitor information.

## Maintenance

Before future releases, fetch recent Sites versions and their deployment statuses. Add/update records using the returned version, source commit, deployment ID, status and update time; deduplicate by deployment ID. Do not pre-label the current unpublished version as successful. The current release enters history on a subsequent publication. Do not put this private history JSON in the public GitHub mirror.

The original static game source remains in `dist/`. The server is a separate Sites Vinext starter in `server-app/`; its `public/` directory and deployment output are generated. Run the Sites dependency installer from `server-app/` if needed, then run `node scripts/build-admin.mjs` at the repository root. This copies the original assets unchanged and builds `dist/server` and `dist/client` for publication. Do not run the standard framework build from the root or replace the original game assets. Existing tests continue to use `dist/`.

## Next phase

A shared visitor milestone log still needs server-side event storage, explicit notices and controls, retention/deletion policy, rate limiting and authenticated event validation. Browser-reported events cannot prove a human or an agent performed them. Agent integrations must carry authorized identities; external portal activity cannot be observed from Krownlandia. No collection endpoint is enabled in this phase.

The public GitHub mirror contains an empty history fixture and an unregistered server manifest. Populate history only from verified records in your private deployment. To run the original game locally, continue serving dist as static files. Server dependencies and build are only needed for the admin route.

## Finding changes

The Search updates field matches all entered words, ignoring case, across version, activity, change summary, outcome, actor and source revision. It combines with Pacific-date filters, and Download CSV exports exactly that filtered set. Search is capped at 160 characters. Reset returns to all records.

Optional `summary` and `summaryEvidence` fields describe verified changes from project notes and the corresponding published source. They are editorial context, separate from the hosting evidence for publication outcomes; they do not establish actor identity. Older records without summaries remain valid. CSV retains its original columns and appends Change summary and Summary source.

Each publication has an initially collapsed Publication evidence section. It shows the full source revision, deployment identifier, hosting record update time in UTC and the separate sources for publication status and editorial summary. The update time is not presented as proof of when a person acted. Deployment identifiers are searchable and use the same filtered CSV export. Evidence is served only after administrator authorization.

## Clean deployment output

`build-admin.mjs` removes only the generated `server-app/dist` before a framework build. Original `dist/` game assets and authored server files are retained. A failed framework build leaves the previous root `dist/server` and `dist/client` intact; a successful build replaces them and verifies their file lists against the fresh output. Build immediately before packaging, and compare the final archive with the fresh framework output before saving. If scratch output retains obsolete files after a build, independently replace `dist/server` and `dist/client` from the successful `server-app/dist` output, then package the validated build without rebuilding. Do not publish an archive that fails comparison.

The tracking-off notice, snapshot coverage and non-live status remain visible. Expand **What this log includes** for scope limitations and actor-identity details. The records region has a visible keyboard-focus outline for horizontal scrolling.
