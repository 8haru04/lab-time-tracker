# Foundation Notes

## Current Goal

This phase builds a lab tool around a simple rule:
people who know the URL should be able to open it from anywhere.

To support that, the repository currently prioritizes:

- static hosting friendliness
- mobile and desktop access
- an app shell that can survive later feature growth
- reduced search discovery without full authentication

## Current Approach

1. Keep the frontend fully static.
2. Discourage search indexing with `noindex` and `robots.txt`.
3. Leave room for future APIs and data storage.
4. Keep the entry page stable even if the backend changes later.

## What This Already Gives You

- a public-first landing shell
- an editable config file
- a PWA manifest
- a service worker
- an offline fallback page

## What Still Needs Decisions

- who can edit and who can only view
- where data should be stored
- whether editing stays public-by-URL or becomes restricted
- whether the app should stay open to the internet or become campus-only later

## Important Note

`noindex` and `robots.txt` reduce accidental discovery, but they do not protect the app.
If the tool will later contain private lab information, add authentication or access controls before that stage.
