/**
 * Ordinary app furniture, designed in Trail's language for the first time.
 *
 * None of this exists in the mockup — it only ever had to render one Today
 * screen. These five are the real test: whether mono labels, the dashed rail
 * and the single black anchor survive a form, a settings list and a sheet, or
 * whether Trail is one beautiful screen with no system behind it.
 *
 * Binding constraints carried forward from M15/M16 (not up for renegotiation
 * by a new visual direction):
 *   - >=44px tap targets, with a visible pressed state
 *   - interactive controls keep a visible border in BOTH themes
 *   - 16px input text (below that, iOS zooms the viewport on focus)
 *   - disabled reads "unpressable", never "broken"
 */

const CONTROLS = `
  .pad { padding: 0 20px; }
  .lab { font-family: "SpaceMono", ui-monospace, monospace; font-size: 9.5px; font-weight: 700; letter-spacing: .15em; text-transform: uppercase; color: var(--mut); display: block; margin: 0 0 7px; }
  .row { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }

  /* Controls need a border that survives both themes — the hairline is too
     faint for that job, so controls get their own stronger tone. */
  .btn {
    font: inherit; font-size: 13px; font-weight: 700; cursor: pointer;
    min-height: var(--tap-min); padding: 0 22px; border-radius: var(--radius-pill);
    display: inline-flex; align-items: center; gap: 8px; transition: transform .12s ease;
  }
  .btn:active { transform: translateY(1px); }
  .btn-primary { background: var(--blk); color: var(--pale); border: 1.5px solid var(--blk); }
  .btn-secondary { background: var(--card); color: var(--ink); border: 1.5px solid color-mix(in srgb, var(--ink) 34%, transparent); }
  .btn-ghost { background: transparent; color: var(--ink); border: 1.5px dashed var(--line); }
  /* Disabled recedes via its surface, NOT by fading the label — a greyed-out
     label measured 2.84:1 and read as broken rather than unpressable. WCAG
     exempts inactive controls; the house rule does not.
     The border stays SOLID: dashed is the ghost button's affordance, and when
     disabled borrowed it the two became indistinguishable on screen. */
  .btn[disabled] { cursor: default; background: color-mix(in srgb, var(--card) 55%, var(--bg)); color: var(--mut); border: 1.5px solid color-mix(in srgb, var(--line) 60%, transparent); }
  .btn[disabled]:active { transform: none; }
`;

const buttons = {
  slug: 'buttons',
  name: 'Buttons',
  group: 'Components',
  subtitle: 'Primary, secondary, ghost, disabled — 44px minimum',
  fonts: ['figtree', 'spacemono'],
  height: 640,
  note:
    'FINDING — the primary button wants to be the anchor mass, but Trail\'s rule is one black anchor ' +
    'per screen and the signpost already claims it. On any screen with both, either the button stops ' +
    'being black or the signpost does. Worth deciding before this becomes app code.',
  css: CONTROLS,
  markup: `
  <div class="pad">
    <span class="lab">Primary · secondary</span>
    <div class="row">
      <button class="btn btn-primary" type="button">Save details</button>
      <button class="btn btn-secondary" type="button">Cancel</button>
    </div>
    <p class="ds-variant" style="margin-left:0">Ghost &amp; disabled</p>
    <div class="row">
      <button class="btn btn-ghost" type="button">Skip for now</button>
      <button class="btn btn-primary" type="button" disabled>Continue</button>
    </div>
    <p class="ds-variant" style="margin-left:0">Full width — the onboarding shape</p>
    <div class="row">
      <button class="btn btn-primary" type="button" style="width:100%; justify-content:center">Continue</button>
    </div>
    <div class="row" style="margin-top:8px">
      <button class="btn btn-primary" type="button" style="width:100%; justify-content:center" disabled>Continue</button>
    </div>
  </div>`,
};

const FIELD = `
  ${CONTROLS}
  .field { margin-bottom: 18px; }
  .field-input {
    width: 100%; font: inherit; font-size: 16px; color: var(--ink);
    background: var(--card); min-height: 52px; padding: 0 15px;
    border-radius: var(--radius-field);
    border: 1.5px solid color-mix(in srgb, var(--ink) 30%, transparent);
  }
  .field-input::placeholder { color: color-mix(in srgb, var(--mut) 85%, transparent); }
  .field-input:focus { outline: 2px solid var(--ink); outline-offset: 1px; border-color: var(--ink); }
  .field.is-focused .field-input { outline: 2px solid var(--ink); outline-offset: 1px; border-color: var(--ink); }
  .field.is-error .field-input { border-color: var(--fr); }
  .field .help { font-size: 12px; color: var(--mut); margin: 6px 0 0; line-height: 1.45; }
  .field.is-error .help { color: var(--fr); }
  .field-input[disabled] { background: color-mix(in srgb, var(--card) 60%, var(--bg)); color: var(--mut); border-style: dashed; }
`;

const fields = {
  slug: 'form-fields',
  name: 'Form fields',
  group: 'Components',
  subtitle: 'Default, focused, error, disabled — 16px text',
  fonts: ['figtree', 'spacemono'],
  height: 820,
  note:
    'The mono label is doing the work that made Trail feel like a map, and it survives here. ' +
    'Focus is a solid ink ring, not a dashed one — dashes are reserved for the rail, and a dashed ' +
    'focus ring read as "unfinished" rather than "active".',
  css: FIELD,
  markup: `
  <div class="pad">
    <div class="field">
      <label class="lab" for="f1">Date of birth</label>
      <input class="field-input" id="f1" value="15 March 1994">
    </div>
    <div class="field is-focused">
      <label class="lab" for="f2">Time of birth</label>
      <input class="field-input" id="f2" value="07:20">
      <p class="help">Focused. If you don't know it, the chart drops to three pillars.</p>
    </div>
    <div class="field">
      <label class="lab" for="f3">Place of birth</label>
      <input class="field-input" id="f3" placeholder="Start typing a city">
    </div>
    <div class="field is-error">
      <label class="lab" for="f4">Year</label>
      <input class="field-input" id="f4" value="1846">
      <p class="help">The tables run from 1900 to 2100.</p>
    </div>
    <div class="field">
      <label class="lab" for="f5">Time of birth</label>
      <input class="field-input" id="f5" value="Unknown" disabled>
      <p class="help">Unpressable, not broken.</p>
    </div>
  </div>`,
};

const SEGMENTED = `
  ${CONTROLS}
  /* The track tint and the unselected label pull toward each other: an 18%
     tint dropped the unselected label to 3.06:1 in light mode. Lighter track,
     inkier label. */
  .seg { display: flex; gap: 3px; padding: 3px; border-radius: var(--radius-pill); background: color-mix(in srgb, var(--mut) 12%, transparent); }
  .seg button {
    flex: 1; font: inherit; font-family: "SpaceMono", ui-monospace, monospace;
    font-size: 10.5px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
    min-height: 40px; border: 0; background: none;
    color: color-mix(in srgb, var(--ink) 62%, var(--mut));
    border-radius: var(--radius-pill); cursor: pointer;
  }
  .seg button[aria-checked="true"] { background: var(--card); color: var(--ink); box-shadow: var(--sh-card); }
  .seg-wrap { min-height: var(--tap-min); display: flex; align-items: center; }
`;

const segmented = {
  slug: 'segmented-control',
  name: 'Segmented control',
  group: 'Components',
  subtitle: 'Two- and three-way choices',
  fonts: ['figtree', 'spacemono'],
  height: 480,
  note: 'Mono uppercase keeps the map register. The selected segment lifts on card fill — in dark that lift is the fill, not the shadow.',
  css: SEGMENTED,
  markup: `
  <div class="pad">
    <span class="lab">Sex</span>
    <div class="seg-wrap"><div class="seg" role="radiogroup" aria-label="Sex">
      <button type="button" role="radio" aria-checked="true">Female</button>
      <button type="button" role="radio" aria-checked="false">Male</button>
    </div></div>
    <p class="ds-variant" style="margin-left:0">Appearance</p>
    <div class="seg-wrap"><div class="seg" role="radiogroup" aria-label="Appearance">
      <button type="button" role="radio" aria-checked="false">Light</button>
      <button type="button" role="radio" aria-checked="false">Dark</button>
      <button type="button" role="radio" aria-checked="true">System</button>
    </div></div>
  </div>`,
};

const LIST = `
  ${CONTROLS}
  .stack { display: grid; gap: 2px; }
  .stack .item {
    display: flex; align-items: center; gap: 12px; width: 100%; text-align: left;
    background: var(--card); border: 0; font: inherit; cursor: pointer;
    min-height: 60px; padding: 12px 15px; color: var(--ink);
  }
  .stack .item:first-child { border-radius: var(--radius-card) var(--radius-card) 0 0; }
  .stack .item:last-child { border-radius: 0 0 var(--radius-card) var(--radius-card); }
  .stack .item:active { background: color-mix(in srgb, var(--ink) 7%, var(--card)); }
  .stack .item .ico { width: 34px; height: 34px; border-radius: 999px; background: color-mix(in srgb, var(--ink) 9%, transparent); display: grid; place-items: center; flex: none; }
  .stack .item .ico svg { width: 19px; height: 19px; }
  .stack .item .txt { flex: 1; }
  .stack .item .txt b { display: block; font-size: 14px; font-weight: 700; }
  .stack .item .txt span { display: block; font-size: 12px; color: var(--mut); margin-top: 2px; }
  .stack .item .meta { font-family: "SpaceMono", ui-monospace, monospace; font-size: 9.5px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--mut); }
  .stack .item[aria-selected="true"] { box-shadow: inset 0 0 0 2px var(--ink); }
`;

const lists = {
  slug: 'segment-list',
  name: 'Segment list',
  group: 'Components',
  subtitle: 'Settings rows, saved people, activity picker',
  fonts: ['figtree', 'spacemono'],
  height: 760,
  note:
    'FINDING — the rail motif does not belong here. Hanging settings rows off a dashed route implies ' +
    'a sequence that a settings screen does not have. The rail stays a reading device; lists are plain ' +
    'segment stacks, and Trail turns out to be quieter away from the Today screen than expected.',
  css: LIST,
  markup: `
  <div class="pad">
    <span class="lab">Saved people</span>
    <div class="stack">
      <button class="item" type="button" aria-selected="true">
        <span class="ico"><svg viewBox="0 0 24 24"><use href="#an-horse" fill="var(--wt)"/></svg></span>
        <span class="txt"><b>Mira</b><span>12 June 1991 · Jakarta</span></span>
        <span class="meta">Active</span>
      </button>
      <button class="item" type="button">
        <span class="ico"><svg viewBox="0 0 24 24"><use href="#an-goat" fill="var(--er)"/></svg></span>
        <span class="txt"><b>Dad</b><span>3 February 1962 · Surabaya</span></span>
      </button>
      <button class="item" type="button">
        <span class="ico"><svg viewBox="0 0 24 24"><use href="#an-snake" fill="var(--wd)"/></svg></span>
        <span class="txt"><b>Them</b><span>28 October 1989 · Singapore</span></span>
      </button>
    </div>
    <p class="ds-variant" style="margin-left:0">Settings</p>
    <div class="stack">
      <button class="item" type="button"><span class="txt"><b>Appearance</b></span><span class="meta">System</span></button>
      <button class="item" type="button"><span class="txt"><b>Edit birth details</b></span><span class="meta">›</span></button>
      <button class="item" type="button"><span class="txt"><b>Download my data</b></span><span class="meta">›</span></button>
    </div>
  </div>`,
};

const SHEET = `
  ${CONTROLS}
  .sheet {
    background: var(--card); border-radius: var(--radius-sheet) var(--radius-sheet) 0 0;
    padding: 10px 20px 26px; box-shadow: var(--sh-hero);
  }
  .sheet .grab { width: 38px; height: 4px; border-radius: 999px; background: color-mix(in srgb, var(--mut) 45%, transparent); margin: 0 auto 16px; }
  .sheet .k { font-family: "SpaceMono", ui-monospace, monospace; font-size: 9.5px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: var(--mut); margin: 0; }
  .sheet h2 { font-family: "Bricolage", "Figtree", sans-serif; font-size: 23px; font-weight: 800; letter-spacing: -.015em; margin: 8px 0 0; color: var(--ink); }
  .sheet p { font-size: 14px; line-height: 1.62; margin: 12px 0 0; color: var(--ink); }
  .sheet .advice { margin-top: 18px; padding-top: 16px; border-top: 1.5px dashed var(--line); }
  .sheet .advice .k { color: var(--wd); }
`;

const sheet = {
  slug: 'bottom-sheet',
  name: 'Bottom sheet',
  group: 'Components',
  subtitle: 'Glossary and read-more, the two-layer explainer',
  fonts: ['figtree', 'bricolage', 'spacemono'],
  height: 620,
  note:
    'The dashed rule before "Working with it" is the one place the rail motif transfers cleanly — ' +
    'it reads as a stage of the same route. Sheet keeps the 28px radius from M16.',
  css: SHEET,
  markup: `
  <div class="sheet">
    <div class="grab"></div>
    <p class="k">Clash · what it means</p>
    <h2>When two signs pull opposite</h2>
    <p>A clash is the old calendars' word for two animal signs sitting across the circle from each other — a door and a draft. It marks movement, not damage: something that was settled gets unsettled, and the day is unusually willing to let you move it.</p>
    <div class="advice">
      <p class="k">Working with it</p>
      <p>If there's a knot you've been circling, today is cheaper than most for pulling at it. Small and reversible first.</p>
    </div>
  </div>`,
};

export const APP_CARDS = [buttons, fields, segmented, lists, sheet];
