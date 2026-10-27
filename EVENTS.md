# Krownlandia event calendar

Open **Activities → What’s happening**, or use the calendar action on the Town Square community board. The production list starts empty: no event dates or hosts have been invented.

The calendar is a published schedule, not a live attendance feed. It does not create a shared multiplayer session, show other visitors, send invitations, or award attendance points. The separate, collapsed anytime section links to the existing circus, safari and Great Journey activities.

## Publishing a confirmed event

Only add an event after Lisa confirms its title, description, start and end time, and location. Edit `CONFIRMED_EVENTS` in `dist/town-square.js`, run the checks below, and publish the Site. GitHub edits alone do not update the hosted Site. Visitors reload the Site to receive a newly published event list; Refresh event status only recalculates the current list's status from the device clock.

Each entry has these fields:

| Field | Meaning |
| --- | --- |
| `id` | Unique lowercase letters, digits and hyphens; keep stable when rescheduling. |
| `title` | Confirmed public event title. |
| `description` | Public description approved for publication. |
| `venue` | `square`, `library`, or `clubhouse`; each has an existing walking destination. |
| `start` | ISO date-time with an explicit UTC `Z` or numeric offset. |
| `end` | ISO date-time with an explicit offset, later than start. |
| `status` | `confirmed`, `canceled`, or `postponed`. |

Times display in Pacific Time, including PST/PDT. Do not use offset-free times, guess a daylight-saving offset, invent attendance figures, or publish personal contact details. Obtain permission before identifying an event host.

Confirmed events show Upcoming before their start, then Scheduled now during their time window. This does not verify that a host is present. Canceled and postponed entries show their former times and offer no event directions. Entries leave the upcoming list when their recorded end time passes. When a new time is confirmed, update the same entry's times and status; otherwise keep it postponed and do not invent a replacement date.

## Checks

```sh
node tests/event-calendar.mjs
node tests/event-calendar-world.mjs
node tests/square-seating.mjs
```

Test fixtures are never included in the production list. Live browser and multiplayer testing are separate from these deterministic checks.
