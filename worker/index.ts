/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  POKOPIA_DLC_CODE?: string;
  GIFT_ACCESS_TOKEN?: string;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/pokopia") {
      const headers = {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store, max-age=0",
      };

      if (request.method !== "POST") {
        return new Response(JSON.stringify({ message: "That parcel only opens from the letter." }), {
          status: 405,
          headers,
        });
      }

      try {
        const body = (await request.json()) as { token?: unknown };
        const expectedToken = env.GIFT_ACCESS_TOKEN ?? process.env.GIFT_ACCESS_TOKEN;
        const dlcCode = env.POKOPIA_DLC_CODE ?? process.env.POKOPIA_DLC_CODE;

        if (!expectedToken || !dlcCode) {
          return new Response(JSON.stringify({ message: "This little parcel is still being prepared." }), {
            status: 503,
            headers,
          });
        }

        if (typeof body.token !== "string" || body.token !== expectedToken) {
          return new Response(JSON.stringify({ message: "This parcel needs its private gift link." }), {
            status: 403,
            headers,
          });
        }

        return new Response(JSON.stringify({ code: dlcCode }), { status: 200, headers });
      } catch {
        return new Response(JSON.stringify({ message: "The parcel could not be opened just now." }), {
          status: 400,
          headers,
        });
      }
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
