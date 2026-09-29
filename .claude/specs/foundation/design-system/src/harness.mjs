/**
 * Preview harness — the chrome around each component card.
 *
 * Deliberately neutral (system font, grey rules) so it never reads as part of
 * the Trail design. Its only job is to let the owner flip theme and terrain on
 * a phone, because "both themes are one design" (2026-07-29) means every card
 * has to be reviewable both ways without changing the OS setting.
 */

export const HARNESS_CSS = `
  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; font-family: "Figtree", system-ui, sans-serif; }

  .ds-bar {
    position: sticky; top: 0; z-index: 90;
    display: flex; flex-wrap: wrap; gap: 10px; align-items: center;
    padding: 10px 14px;
    background: color-mix(in srgb, var(--bg) 88%, transparent);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--line);
    font-family: system-ui, sans-serif;
  }
  .ds-bar .ds-label {
    font-size: 9.5px; font-weight: 700; letter-spacing: .12em;
    text-transform: uppercase; color: var(--mut);
  }
  .ds-seg { display: flex; gap: 2px; padding: 2px; border-radius: 999px; background: color-mix(in srgb, var(--mut) 16%, transparent); }
  .ds-seg button {
    border: 0; background: none; cursor: pointer; font: inherit;
    font-size: 11px; font-weight: 700; color: var(--mut);
    padding: 5px 11px; border-radius: 999px; min-height: 30px;
  }
  .ds-seg button[aria-pressed="true"] { background: var(--card); color: var(--ink); }
  .ds-terrain { display: flex; gap: 4px; }
  .ds-terrain button {
    width: 26px; height: 26px; padding: 0; border-radius: 999px; cursor: pointer;
    border: 1px solid var(--line); font-size: 0;
  }
  .ds-terrain button[aria-pressed="true"] { outline: 2px solid var(--ink); outline-offset: 2px; }

  .ds-stage { padding: 22px 0 60px; display: flex; justify-content: center; }
  .ds-frame { width: 390px; max-width: 100%; }

  .ds-note {
    margin: 0 20px 18px; padding: 10px 12px; border-radius: 10px;
    border: 1px dashed var(--line); color: var(--mut);
    font-family: system-ui, sans-serif; font-size: 11.5px; line-height: 1.5;
  }
  .ds-variant {
    margin: 26px 20px 8px; font-family: system-ui, sans-serif;
    font-size: 9.5px; font-weight: 700; letter-spacing: .12em;
    text-transform: uppercase; color: var(--mut);
    display: flex; align-items: center; gap: 8px;
  }
  .ds-variant::after { content: ""; flex: 1; height: 1px; background: var(--line); }
`;

/** Terrain swatch buttons use the light-mode ground so they read as paper chips. */
export function harnessMarkup(terrains) {
  const swatches = terrains
    .map(
      (t) =>
        `<button type="button" data-terrain-set="${t.key}" aria-pressed="${t.key === 'wood'}" ` +
        `style="background:${t.lightBg}" title="${t.label} — ${t.terrain}">${t.label}</button>`,
    )
    .join('');

  return `
  <div class="ds-bar">
    <span class="ds-label">Theme</span>
    <div class="ds-seg" role="group" aria-label="Theme">
      <button type="button" data-theme-set="light" aria-pressed="false">Light</button>
      <button type="button" data-theme-set="dark" aria-pressed="false">Dark</button>
      <button type="button" data-theme-set="system" aria-pressed="true">System</button>
    </div>
    <span class="ds-label">Terrain</span>
    <div class="ds-terrain" role="group" aria-label="Day terrain">${swatches}</div>
  </div>`;
}

export const HARNESS_JS = `
  (function () {
    var root = document.documentElement;
    function press(sel, attr, value) {
      document.querySelectorAll(sel).forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.getAttribute(attr) === value));
      });
    }
    document.querySelectorAll("[data-theme-set]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var v = btn.getAttribute("data-theme-set");
        if (v === "system") root.removeAttribute("data-theme");
        else root.setAttribute("data-theme", v);
        press("[data-theme-set]", "data-theme-set", v);
      });
    });
    // Terrain lives on :root so body and page chrome resolve the tokens. The
    // palette card pins one block per terrain inside the body to compare all
    // five at once; those override locally and are untouched by this.
    document.querySelectorAll("[data-terrain-set]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var v = btn.getAttribute("data-terrain-set");
        root.setAttribute("data-terrain", v);
        press("[data-terrain-set]", "data-terrain-set", v);
      });
    });
  })();
`;
