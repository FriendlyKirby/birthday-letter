# Personalize the birthday letter

1. Open `content/giftContent.ts`. This is the one place to change the recipient, letter, gift notes, music, download name, and ending.
2. For GitHub Pages, paste the Pokopia code into `pokopia.code` in `content/giftContent.ts`. GitHub Pages is static, so the code will be present in the published browser files. Use an unlisted URL and do not commit the real code to a public repository if that exposure is unacceptable.
3. The extension ZIP is `public/downloads/chrome-web-store-submission-v0.2.14.zip`. When replacing it, update `extension.downloadPath` and `extension.version` in `content/giftContent.ts` to match the new filename.
4. Run `pnpm run dev:pages` to preview the exact static version used by GitHub Pages.
5. Run `pnpm run build:pages` after every content or design edit. The finished files are written to `pages-dist/`.
6. Commit both the source edits and `pages-dist/`, then push the `main` branch to GitHub. GitHub Actions publishes the already-built folder automatically.

Before gifting, open the published URL once on desktop and once on a phone. Test the code reveal, copy button, extension download, and all final wording.
