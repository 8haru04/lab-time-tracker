# Deploy With GitHub Pages

This project is configured for a production deployment through GitHub Pages.

## What Is Already Prepared

- a GitHub Actions workflow at `.github/workflows/deploy-pages.yml`
- static assets isolated in `public/`
- relative asset paths so the site can work under a repository subpath

## What You Need To Do

1. Create a GitHub repository for this project.
2. Push this folder to the repository.
3. In GitHub, open `Settings` -> `Pages`.
4. Set the source to `GitHub Actions`.
5. Push to `main`, or run the workflow manually from the `Actions` tab.

## Expected Production URL

If the repository name is `lab-time-tracker` and the owner is `YOUR_ACCOUNT`, the default Pages URL will be:

`https://YOUR_ACCOUNT.github.io/lab-time-tracker/`

## Optional Custom Domain

If you later want a cleaner URL, you can add a custom domain in GitHub Pages settings and create the matching DNS records with your domain provider.

## Notes

- This deployment is static-only for now.
- `noindex` reduces search discovery, but it does not secure the site.
- If the app later needs private data or edit permissions, add authentication before storing that data publicly.
