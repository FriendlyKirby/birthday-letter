import assert from "node:assert/strict";
import test from "node:test";

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);

const ctx = {
  waitUntil() {},
  passThroughOnException() {},
};

const baseEnv = {
  ASSETS: {
    fetch: async () => new Response("Not found", { status: 404 }),
  },
};

test("server-renders the finished birthday experience", async () => {
  const response = await worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    baseEnv,
    ctx,
  );

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /A Little Letter, Carried by Summer/i);
  assert.match(html, /Fae Post/);
  assert.match(html, /Pokopia Expansion Pass/);
  assert.match(html, /chrome-web-store-submission-v0\.2\.14\.zip/);
  assert.match(html, /K\.K\. Lovers/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
  assert.doesNotMatch(html, /CODEX-TEST-NEVER-BUNDLE-8291/);
});

test("Pokopia endpoint refuses an invalid gift link", async () => {
  const response = await worker.fetch(
    new Request("http://localhost/api/pokopia", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token: "wrong" }),
    }),
    {
      ...baseEnv,
      POKOPIA_DLC_CODE: "TEST-GIFT-CODE",
      GIFT_ACCESS_TOKEN: "correct-token",
    },
    ctx,
  );

  assert.equal(response.status, 403);
  assert.match(response.headers.get("cache-control") ?? "", /no-store/);
  assert.doesNotMatch(await response.text(), /TEST-GIFT-CODE/);
});

test("Pokopia endpoint returns the code only for the private gift link", async () => {
  const response = await worker.fetch(
    new Request("http://localhost/api/pokopia", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token: "correct-token" }),
    }),
    {
      ...baseEnv,
      POKOPIA_DLC_CODE: "TEST-GIFT-CODE",
      GIFT_ACCESS_TOKEN: "correct-token",
    },
    ctx,
  );

  assert.equal(response.status, 200);
  assert.match(response.headers.get("cache-control") ?? "", /no-store/);
  assert.deepEqual(await response.json(), { code: "TEST-GIFT-CODE" });
});
