export const giftContent = {
  recipientName: "Raneem",
  senderName: "Jin",
  salutation: "My most beautiful fairy princess,",
  cardTitle: "Happy Birthday, my love",
  cardSubtitle: "For the light of my life",
  letterMessage: `I hope today, and all the tomorrows to come, wrap around you as softly as sunshine through the trees.

You make ordinary days feel warmer, funnier, and so much more beautiful. Loving you is one of the easiest and happiest things I have ever done, and I feel lucky every day that I get to know you, cheer for you, and dream about all the little tomorrows we still have ahead of us.

I wanted to gather a few small pieces of that love here for you. Some are things to open, some are things to look forward to, and all of them are just another way of saying that you are precious to me.

Happy birthday, Raneem. I love you more than I ever manage to fit into words.`,
  finalMessage:
    "For this birthday, and all of the ones to come after it. I love you.",
  pokopia: {
    eyebrow: "A whole new world for you",
    title: "Something new to explore",
    message:
      "A Pokémon Pokopia Expansion Pass, with new places, new friends, and one more cozy world to make your own.",
    code: "E1XL3J7B5MXC5D8R",
  },
  spoilingMessage: "I just want to spoil you for the rest of our lives.",
  earbudsMessage:
    "If your brother ends up not getting you the earbuds, let me know and I’ll pick out the best ones for you and buy them for you.",
  extension: {
    title: "Daily Puzzle Launcher",
    message:
      "I made you a tiny companion for keeping our daily games in one sweet, tidy place.",
    chromeDownloadPath: "/downloads/daily-puzzle-launcher-chrome-brave-v0.2.14.zip",
    safariDownloadPath: "/downloads/daily-puzzle-launcher-safari-v0.2.14.zip",
    version: "v0.2.14",
  },
  music: {
    title: "K.K. Lovers",
    artist: "K.K. Slider",
    youtubeVideoId: "_y9Di1Vkrbc",
  },
} as const;

export type GiftContent = typeof giftContent;
