# Lab Time Tracker

This repository is a public-first foundation for a lab management tool.

The goal of this phase is simple:

- people who know the URL can open it from anywhere
- the frontend can be deployed as static files
- later UI and features can be added without rebuilding the base

## Run Locally

Use PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File .\server.ps1 -Port 8080
```

Open:

- `http://localhost:8080/`
- `http://<this-pc-ip>:8080/`

## Structure

- `public/`
  Public app files. This folder can be deployed to a static host.
- `public/app-config.json`
  Editable app metadata and future module placeholders.
- `data/`
  Non-public working directory for future exports or backups.
- `docs/foundation.md`
  Notes about the current architecture and next decisions.

## Current Scope

- public URL friendly app shell
- `noindex` and `robots.txt` to reduce search discovery
- PWA manifest
- service worker
- offline fallback page
- editable config file

## Important Note

This is convenience-first access, not strong security.

- anyone with the URL can still open the app
- `noindex` and `robots.txt` only reduce accidental discovery
- if you later store private data, add authentication or access control

## Natural Next Steps

- attendance and presence UI
- lab schedule UI
- equipment and room booking UI
- announcements board
- authentication for editors

## Production Path

This repository is now prepared for GitHub Pages deployment.

Files added for production:

- `.github/workflows/deploy-pages.yml`
- `docs/deploy-github-pages.md`

Once this project is pushed to a GitHub repository and Pages is enabled with GitHub Actions, the site will publish automatically on pushes to `main`.
