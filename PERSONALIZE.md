# Personalize the birthday letter

1. Open `content/giftContent.ts`. This is the one place to change the recipient, letter, gift notes, download name, and ending.
2. Keep the real Pokopia code private. Set `POKOPIA_DLC_CODE` and a long random `GIFT_ACCESS_TOKEN` in the hosting environment. Send the site as `https://your-site.example/?gift=YOUR_LONG_TOKEN`.
3. The extension ZIP is `public/downloads/daily-games-extension.zip`. Rebuild it from the contents of `extension/` after changing the extension.
4. To add the couple artwork, put the three PNG files at the paths listed in `content/giftContent.ts`, then change `couplePfp.enabled` to `true`.
5. For local secrets, copy `.env.example` to `.env.local` and replace only the values. Never commit the real code or token.

Before gifting, open the private URL once on desktop and once on a phone. Test the code reveal, copy button, extension download, and all final wording.
