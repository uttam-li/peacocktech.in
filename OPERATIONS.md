# OPERATIONS — Peacock Technotrics

## Uptime (only monitoring wired)

**Site exposes:** `/health` returns `{"status":"ok",...}` with HTTP 200. Uptime service pings this endpoint.

**Setup (5 minutes, free):**
1. Create a free account at UptimeRobot.com.
2. Add Monitor → Monitor Type: `Keyword` → URL: `https://peacocktech.in/health` → Keyword: `ok`.
3. Add alert contact email: **support@peacocktech.in** → Save.
4. Set the check interval to 5 minutes. You will receive an alert at this email when the site goes down.

**If downtime is reported:**
1. Open the site yourself — confirm whether it is actually down or a false alarm from the monitor.
2. Check the hosting dashboard (failed deploy? expired domain?).
3. After recovery, review the last change with `git log`; if the issue persists, re-upload the previous build's `dist/` (rollback).
4. Daily test: submit a test entry via the contact form — if it arrives in the inbox, the lead flow is working.

## Weekly (2 minutes)

- UptimeRobot dashboard: verify the green line.
- Submit a test lead; check the inbox + auto-reply (once Phase 8 is live).
- Record a deploy note in `CHANGELOG.md` (automatic from Phase 8 onward).
