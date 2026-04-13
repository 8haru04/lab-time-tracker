# Shared Store Setup

## Goal

This app is deployed as a static GitHub Pages site, so browser-only local storage does not sync between users.

To make these features shared:

- user registration
- display name updates
- presence input
- my tasks
- clock in / out
- clock correction requests

the app can use a Supabase database as a shared store.

## What Is Included

- frontend sync code in `public/app.js`
- config fields in `public/app-config.json`
- SQL setup file in `data/supabase-shared-store.sql`
- incremental SQL for correction requests in `data/supabase-clock-change-requests.sql`

## What You Need To Do

1. Create a Supabase project.
2. Open the SQL Editor.
3. Paste and run `data/supabase-shared-store.sql`.
4. Open `Project Settings -> API`.
5. Copy:
   - Project URL
   - publishable key or legacy anon key
6. Open `public/app-config.json`.
7. Fill `sharedStore.url` and `sharedStore.anonKey`.
8. Change `sharedStore.enabled` to `true`.
9. Push the change to GitHub Pages.

If you already ran the old SQL before the correction-request feature was added, run:

- `data/supabase-clock-change-requests.sql`

## Config Example

```json
"sharedStore": {
  "provider": "supabase",
  "enabled": true,
  "url": "https://YOUR_PROJECT_REF.supabase.co",
  "anonKey": "YOUR_PUBLIC_KEY",
  "syncIntervalSeconds": 20
}
```

## Notes

- The current login is still student-number only.
- This means the shared store is convenience-first, not strong security.
- The SQL policy file allows `anon` access because the current app does not use Supabase Auth yet.
- If you later add real authentication, tighten the policies before storing private data.

## How Shared Sync Works

- The app seeds the configured default users into Supabase if they are missing.
- It loads shared data on startup.
- It polls for remote updates every few seconds.
- If the shared store is unavailable, the app falls back to local browser storage for that session.
