# Personalize the birthday letter

1. Open `content/giftContent.ts`. This is the one place to change the recipient, letter, gift notes, download name, and ending.
2. For GitHub Pages, paste the Pokopia code into `pokopia.code` in `content/giftContent.ts`. GitHub Pages is static, so the code will be present in the published browser files. Use an unlisted URL and do not commit the real code to a public repository if that exposure is unacceptable.
3. The extension ZIP is `public/downloads/daily-games-extension.zip`. Rebuild it from the contents of `extension/` after changing the extension.
4. Run `pnpm run dev:pages` to preview the exact static version used by GitHub Pages.
5. Push the `main` branch to GitHub, then choose GitHub Actions as the Pages source in the repository settings.

Before gifting, open the published URL once on desktop and once on a phone. Test the code reveal, copy button, extension download, and all final wording.
