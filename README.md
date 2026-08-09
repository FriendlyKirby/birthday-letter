# A Little Letter, Carried by Summer

A private interactive birthday letter with a tactile envelope, a Pokopia Expansion Pass reveal, and a downloadable daily-games Chrome extension.

## Start here

Read `PERSONALIZE.md`, then edit `content/giftContent.ts`.

The GitHub Pages version is fully static. Its Pokopia code is revealed in the browser, so a public repository or published build cannot keep that value truly secret.

## Commands

```text
pnpm install
pnpm run dev:pages
pnpm run test:pages
```

The unpacked legacy Chrome extension source is in `extension/`. The current v0.2.14 gift package is in `public/downloads/`.

After editing content, rebuild with `pnpm run build:pages`, commit the updated `pages-dist/` folder, and push `main`. The GitHub Actions workflow deploys that folder without reinstalling dependencies.
