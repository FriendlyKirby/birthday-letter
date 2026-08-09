import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:5173";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const baseUrl = new URL(`${protocol}://${host}`);

  return {
    metadataBase: baseUrl,
    title: "A Little Letter, Carried by Summer",
    description: "A private birthday letter filled with love and little surprises.",
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    openGraph: {
      title: "A Little Letter, Carried by Summer",
      description: "A private birthday letter filled with love and little surprises.",
      type: "website",
      images: [{ url: "/og.png", width: 1760, height: 910, alt: "An enchanted birthday letter among lily-of-the-valley flowers" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "A Little Letter, Carried by Summer",
      description: "A private birthday letter filled with love and little surprises.",
      images: ["/og.png"],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
