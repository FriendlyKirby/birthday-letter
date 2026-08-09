(() => {
  const existing = document.querySelector("#our-daily-games-launcher");
  if (existing) {
    existing.remove();
    return;
  }

  const host = document.createElement("div");
  host.id = "our-daily-games-launcher";
  const root = host.attachShadow({ mode: "open" });
  root.innerHTML = `
    <style>
      :host { all: initial; }
      .wrap { position: fixed; right: 18px; bottom: 18px; z-index: 2147483647; font-family: "Segoe UI", sans-serif; }
      button { border: 0; font: inherit; cursor: pointer; }
      .bubble { width: 54px; height: 54px; border-radius: 50%; color: #fff; background: #4d7a64; box-shadow: 0 10px 28px rgba(29,57,43,.28); font-size: 20px; }
      .panel { width: 240px; margin-bottom: 9px; padding: 14px; border: 1px solid #dce4d4; border-radius: 16px; color: #294b3e; background: #fffdf5; box-shadow: 0 15px 40px rgba(29,57,43,.2); }
      .panel[hidden] { display: none; }
      h2 { margin: 0 0 10px; font-family: Georgia, serif; font-size: 20px; font-weight: 500; }
      a { display: block; margin: 6px 0; padding: 9px 10px; overflow: hidden; border-radius: 9px; color: #294b3e; background: #eaf1e3; font-size: 12px; font-weight: 750; text-decoration: none; text-overflow: ellipsis; white-space: nowrap; }
      a:hover { background: #dbe9d4; }
      button:focus-visible, a:focus-visible { outline: 2px solid #2f6f5c; outline-offset: 2px; }
    </style>
    <div class="wrap">
      <section class="panel" hidden><h2>Our daily games</h2><nav></nav></section>
      <button class="bubble" type="button" aria-label="Open our daily games" aria-expanded="false">♡</button>
    </div>`;

  const panel = root.querySelector(".panel");
  const button = root.querySelector(".bubble");
  const nav = root.querySelector("nav");

  async function render() {
    const { sites = [] } = await chrome.storage.local.get("sites");
    nav.replaceChildren(...sites.map((site) => {
      const link = document.createElement("a");
      link.href = site.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = site.name;
      return link;
    }));
  }

  button.addEventListener("click", async () => {
    const opening = panel.hidden;
    panel.hidden = !opening;
    button.setAttribute("aria-expanded", String(opening));
    if (opening) await render();
  });
  chrome.storage.onChanged.addListener(render);
  document.documentElement.append(host);
})();
