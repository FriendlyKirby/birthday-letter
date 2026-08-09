# A Little Letter, Carried by Summer

A private interactive birthday letter with a tactile envelope, a Pokopia Expansion Pass reveal, a downloadable daily-games Chrome extension, and optional couple artwork.

## Start here

Read `PERSONALIZE.md`, then edit `content/giftContent.ts`. The site is intentionally complete while `couplePfp.enabled` is `false`.

The real Pokopia code is never stored in the website source. It is released by the server only when the visitor opens the gift using the private token in the URL.

## Commands

```text
pnpm install
pnpm run dev
pnpm test
```

The unpacked Chrome extension source is in `extension/`. Its gift-ready ZIP is in `public/downloads/`.
