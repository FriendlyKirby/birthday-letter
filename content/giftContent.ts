export const giftContent = {
  recipientName: "my love",
  senderName: "always yours",
  cardTitle: "Happy Birthday, my love",
  cardSubtitle: "A little letter, carried by summer",
  letterMessage: `I hope today wraps around you as softly as sunshine through the trees.

You make ordinary days feel warmer, funnier, and so much more beautiful. Loving you is one of the easiest and happiest things I have ever done, and I feel lucky every day that I get to know you, cheer for you, and dream about all the little tomorrows we still have ahead of us.

I wanted to gather a few small pieces of that love here for you. Some are things to open, some are things to look forward to, and all of them are just another way of saying that you are precious to me.

Happy birthday, sweetheart. I love you more than I ever manage to fit into words.`,
  finalMessage:
    "For this birthday, and every quiet little adventure after it. I love you.",
  pokopia: {
    eyebrow: "A whole new world for you",
    title: "Something new to explore",
    message:
      "A Pokémon Pokopia Expansion Pass, with new places, new friends, and one more cozy world to make your own.",
  },
  spoilingMessage: "I just want to spoil you for the rest of our lives.",
  earbudsMessage:
    "If your brother ends up not getting you the earbuds, let me know and I’ll pick out the best ones for you and buy them for you.",
  extension: {
    title: "Our games, all together",
    message:
      "I made you a tiny Chrome companion for keeping our daily games in one sweet, tidy place.",
    downloadPath: "/downloads/daily-games-extension.zip",
  },
  couplePfp: {
    enabled: false,
    cardIllustration: "/assets/couple/couple-illustration.png",
    herPfp: "/assets/couple/her-pfp.png",
    myPfp: "/assets/couple/my-pfp.png",
  },
} as const;

export type GiftContent = typeof giftContent;
