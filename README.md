# WASI DEX

WASI DEX is a static, GitHub-shareable website for exploring 54 African AFEX sovereign instruments, export-model families, and XOF reference FX views.

## What is included

- `index.html`, `app.js`, `styles.css`: the standalone site
- `exports/`: embedded AFEX JSON and Markdown resources so the site works without sibling folders
- `.github/workflows/deploy-pages.yml`: automatic GitHub Pages deployment
- `preview-card.svg`: lightweight social preview asset

## Publish on GitHub Pages

1. Create a new GitHub repository.
2. Upload the full contents of this `wasi-dex` folder as the repository root.
3. Push to the `main` branch.
4. In GitHub, open `Settings` > `Pages` and ensure `GitHub Actions` is enabled as the source if prompted.
5. Wait for the `Deploy WASI DEX to GitHub Pages` workflow to finish.

Your public URL will be:

- `https://<your-username>.github.io/<repo-name>/`

If you want the site at the root domain format below, use a repository named `<your-username>.github.io`:

- `https://<your-username>.github.io/`

## Notes

- No build step is required.
- All AFEX export files used by the interface are local inside `exports/`.
- The FX screen attempts live refresh from Frankfurter and falls back to embedded reference values if the API is unavailable.
