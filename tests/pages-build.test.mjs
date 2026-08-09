import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const output = new URL("../pages-dist/", import.meta.url);

test("GitHub Pages build contains the complete static gift", async () => {
  const html = await readFile(new URL("index.html", output), "utf8");
  assert.match(html, /A Little Letter, Carried by Summer/);
  assert.match(html, /assets\/index-[^\"']+\.js/);

  await access(new URL("assets/pokopia/expansion-pass-hero.jpg", output));
  await access(new URL("downloads/daily-games-extension.zip", output));
  await access(new URL("og.png", output));
});

test("GitHub Pages client has no duplicate Pokopia logo or couple PFP UI", async () => {
  const files = await readdir(new URL("assets/", output));
  const scriptName = files.find((file) => /^index-.*\.js$/.test(file));
  assert.ok(scriptName);
  const script = await readFile(new URL(`assets/${scriptName}`, output), "utf8");
  assert.doesNotMatch(script, /bubbly-basin-logo/);
  assert.doesNotMatch(script, /couplePfp|Save yours|Save mine/);
});
