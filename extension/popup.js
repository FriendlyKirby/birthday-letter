const DEFAULT_SITES = [
  { id: crypto.randomUUID(), name: "Wordle", url: "https://www.nytimes.com/games/wordle/index.html" },
  { id: crypto.randomUUID(), name: "Connections", url: "https://www.nytimes.com/games/connections" },
  { id: crypto.randomUUID(), name: "Strands", url: "https://www.nytimes.com/games/strands" }
];

const list = document.querySelector("#sites");
const form = document.querySelector("#add-site");
const status = document.querySelector("#status");
let sites = [];

async function loadSites() {
  const stored = await chrome.storage.local.get("sites");
  sites = Array.isArray(stored.sites) ? stored.sites : DEFAULT_SITES;
  if (!stored.sites) await saveSites();
  render();
}

async function saveSites() {
  await chrome.storage.local.set({ sites });
}

function render() {
  list.replaceChildren();
  for (const [index, site] of sites.entries()) {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = site.url;
    link.target = "_blank";
    link.textContent = site.name;
    link.title = site.url;

    const controls = document.createElement("div");
    controls.className = "controls";
    controls.append(
      controlButton("↑", "Move up", () => move(index, -1), index === 0),
      controlButton("↓", "Move down", () => move(index, 1), index === sites.length - 1),
      controlButton("×", "Remove", () => remove(site.id))
    );
    item.append(link, controls);
    list.append(item);
  }
}

function controlButton(text, label, action, disabled = false) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = text;
  button.title = label;
  button.setAttribute("aria-label", label);
  button.disabled = disabled;
  button.addEventListener("click", action);
  return button;
}

async function move(index, offset) {
  const [site] = sites.splice(index, 1);
  sites.splice(index + offset, 0, site);
  await saveSites();
  render();
}

async function remove(id) {
  sites = sites.filter((site) => site.id !== id);
  await saveSites();
  render();
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = document.querySelector("#name").value.trim();
  const url = new URL(document.querySelector("#url").value).href;
  sites.push({ id: crypto.randomUUID(), name, url });
  await saveSites();
  form.reset();
  render();
  status.textContent = `${name} was added.`;
});

document.querySelector("#show-page").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id || !tab.url?.startsWith("http")) {
    status.textContent = "Open a regular website first.";
    return;
  }
  const origin = `${new URL(tab.url).origin}/*`;
  const granted = await chrome.permissions.request({ origins: [origin] });
  if (!granted) {
    status.textContent = "Permission was not granted for this site.";
    return;
  }
  await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ["content.js"] });
  status.textContent = "The launcher is now on this page.";
});

loadSites();
