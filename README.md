# Krownlandia

An interactive browser-based Krownlandia Theme Park and community-world prototype, with attractions, discovery walks, themed lounges, housing, rewards stations, and keepsakes.

## Explore

[Krownlandia Gateway](https://krownlandia-gateway.lisachandleremail.chatgpt.site/) is the hosted version. Its existing access settings still apply. [Krownlandia.com](https://www.krownlandia.com/) provides public community information.

## Run locally

The application is static HTML, CSS and JavaScript using the bundled Three.js modules. No build step is required. With Python 3 installed:

```sh
python3 -m http.server 8000 --directory dist
```

Open http://localhost:8000 in a browser with WebGL support. Serve the files over HTTP rather than opening index.html directly. Alternatively, install the locked development dependencies with `npm ci` and run `npm run dev`.

Progress is stored locally in the visitor's browser. Use the in-world backup controls to export or restore progress. Different hosts have separate browser storage. This prototype does not provide shared multiplayer property ownership, real purchases, or shared live attendance.

## Source and checks

- `dist/`: application source and static assets (despite the directory name, no compilation is needed).
- `tests/`: Node.js regression checks.
- `CREDITS.md`: community origins, source attributions and prototype boundaries.

Run focused checks with Node.js, for example:

```sh
node tests/community-walk.mjs
node tests/backup.mjs
node tests/journal.mjs
```

The deterministic scene tests do not replace live browser, WebGL, accessibility or visual testing.

## Community origins and credits

Krownlandia predates this prototype. Its recorded community origins date to January 22, 2020 in the KROWN DAC and Token Telegram community. Designer: Lisa Chandler (@lisachandler). Naming credit: @gorayii. Individual community place credits remain in the application and CREDITS.md, including Library of Alexandria by @Jauregui9821. ChatGPT assisted with this recent prototype implementation; it did not originate Krownlandia.

## Publication and licensing

This source snapshot corresponds to hosted version 224. Private Sites hosting configuration and prior hosting-repository history are excluded. Publishing this repository does not automatically deploy GitHub changes to the hosted Site or synchronize later Site changes back here.

Three.js retains its license at `dist/vendor/LICENSE`. No project-wide open-source license has been selected; public visibility alone does not grant a general license to reuse project code, community material, branding or artwork.

## Private points history

In Rewards, expand **My points over time** to see this hour, today, this month, this year and all-time totals in Pacific Time. New point claims receive device timestamps; older points remain undated legacy progress in the all-time total. This is private browser-local history, not a shared or server-verified leaderboard. Existing progress backups include the optional timestamps; older backups remain compatible.

Additional checks: `node tests/reward-history.mjs` and `node tests/reward-history-panel.mjs`.

## Event calendar

Open **Activities → What’s happening** or the Town Square community board for the published event calendar. The initial list is empty pending owner-confirmed events. A collapsed anytime section offers directions to the circus, safari and Great Journey. See [EVENTS.md](EVENTS.md) for publishing instructions and status behavior. This is not a live attendance feed or multiplayer service.

## Community portals

Visit Living Sim Portal and Emoji House west of Town Square, both with place manager @maxigram. Search the map for `maxigram` or use the square board. External links open only by choice in a new tab; sticker artwork has not yet been imported. See [COMMUNITY_PORTALS.md](COMMUNITY_PORTALS.md).

Portal checks: `node tests/community-portals.mjs`. The broad smoke walkthrough passes, including retained food searches, explicit clearing with keyboard focus, and guarded lounge view controls. GPU rendering and audio playback are not covered.

Controls & help includes searchable Living Sim Portal and Emoji House directions; search `maxigram` to find both topics.

The Clubhouse board includes a collapsed Places & their managers section with walking directions to Living Sim Portal and Emoji House, credited to @maxigram.

Both portal panels offer a collapsed Explore nearby section with walking directions to the other pavilion and Town Square.

## Admin activity log

The hosted `/admin/activity` page is restricted to the configured administrator and lists verified build publications. Visitor tracking is off. The public source contains an empty history fixture, not private deployment records. See [ADMIN_ACTIVITY.md](ADMIN_ACTIVITY.md) for server build and maintenance details. The original static game remains runnable as described above.
