/**
 * Trail components as they exist today, ported from the `.v6` rules and markup
 * in docs/mockups-m18/today-three-treatments.html.
 *
 * These are a faithful port, not a redesign — the point of isolating them is to
 * see whether each one still holds up away from the composed screen that has
 * been carrying them. The palette preview capsule is deliberately not here: it
 * was mockup-only chrome for flipping terrains on a locked fixture day.
 */

/** Shared Trail typography — every card in this group needs it. */
const BASE = `
  .pad { padding: 0 20px; }
  svg text { font-family: "SpaceMono", ui-monospace, monospace; font-weight: 700; fill: var(--mut); letter-spacing: .12em; }
  .kick { margin: 0 0 10px; font-family: "SpaceMono", ui-monospace, monospace; font-size: 10px; font-weight: 700; letter-spacing: .17em; text-transform: uppercase; color: var(--mut); display: flex; align-items: center; gap: 9px; }
  .kick::before { content: ""; width: 16px; height: 2px; background: var(--mut); flex: none; }
`;

const datebar = {
  slug: 'datebar',
  name: 'Datebar & compass mark',
  group: 'Trail',
  subtitle: 'Mono date + the orbit logo doubling as a compass rose',
  fonts: ['figtree', 'spacemono'],
  height: 320,
  note: 'The orbit mark is the existing personal logo (2026-07-17), reused here as the map\'s compass rose.',
  css: `${BASE}
  .datebar { display: flex; justify-content: space-between; align-items: center; padding-top: 8px; }
  .datebar .d { font-family: "SpaceMono", ui-monospace, monospace; font-size: 11px; font-weight: 700; letter-spacing: .18em; color: var(--ink); }
  .datebar .logo { color: var(--ink); }
  `,
  markup: `
  <div class="pad">
    <div class="datebar">
      <span class="d">WED · 29 JULY</span>
      <svg class="logo" width="26" height="26" viewBox="0 0 24 24" role="img" aria-label="Daymaster"><use href="#orbit-mark"/></svg>
    </div>
  </div>`,
};

const headline = {
  slug: 'headline',
  name: 'Kicker & headline',
  group: 'Trail',
  subtitle: 'Bricolage 800 with a serif-italic emphasis run',
  fonts: ['figtree', 'bricolage', 'spacemono'],
  height: 620,
  note: 'The italic run is where the headline earns its voice. Three lengths shown — the balance has to survive the short one and the long one, since the copy is generated.',
  css: `${BASE}
  h1 { margin: 12px 0 0; font-family: "Bricolage", "Figtree", sans-serif; font-size: 35px; line-height: 1.07; font-weight: 800; letter-spacing: -.022em; text-wrap: balance; color: var(--ink); }
  h1 em { font-family: ui-serif, "New York", Georgia, serif; font-style: italic; font-weight: 500; letter-spacing: -.005em; }
  .grain { margin: 14px 0 0; font-size: 14px; line-height: 1.62; color: var(--ink); }
  `,
  markup: `
  <div class="pad">
    <p class="kick">Today's terrain</p>
    <h1>The day runs <em>crosswise</em>. Movement, not misfortune.</h1>
    <p class="grain">A Wood day over the dragon — it presses on your Earth, so beginnings feel effortful. Pace them rather than force them.</p>
  </div>
  <p class="ds-variant">Short</p>
  <div class="pad"><h1>A day for <em>finishing</em>.</h1></div>
  <p class="ds-variant">Long</p>
  <div class="pad"><h1>Support gathers where you were not looking, and the <em>cost of hurrying</em> is higher than usual today.</h1></div>`,
};

const legend = {
  slug: 'legend-tags',
  name: 'Legend tags',
  group: 'Trail',
  subtitle: 'Map-legend chips — filled, and dashed for a notice',
  fonts: ['figtree', 'spacemono'],
  height: 330,
  css: `${BASE}
  .legend { margin: 0; display: flex; flex-wrap: wrap; gap: 7px; align-items: center; }
  .legend .tag { display: inline-flex; align-items: center; gap: 6px; font-family: "SpaceMono", ui-monospace, monospace; font-size: 9.5px; font-weight: 700; letter-spacing: .08em; color: var(--mut); background: var(--card); border-radius: 999px; padding: 5px 11px; }
  .legend .tag svg { width: 14px; height: 14px; }
  .legend .tag.notice { background: transparent; border: 1.5px dashed var(--line); }
  `,
  markup: `
  <div class="pad">
    <div class="legend">
      <span class="tag"><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#el-wood" fill="var(--wd)"/></svg>WOOD · YANG</span>
      <span class="tag"><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#an-dragon" fill="var(--ink)"/></svg>DRAGON DAY</span>
      <span class="tag notice">RECEIVE — GATHERING-IN</span>
    </div>
  </div>`,
};

const mapHero = {
  slug: 'map-hero',
  name: 'Contour map hero',
  group: 'Trail',
  subtitle: 'The day as a route; the clash is a marked crossing',
  fonts: ['figtree', 'spacemono'],
  height: 480,
  note: 'The most expensive object in the direction — and the one that has to be generated per day from real chart data, not drawn once.',
  css: `${BASE}
  .mapcard { background: var(--card); border-radius: var(--radius-hero); overflow: hidden; box-shadow: var(--sh-hero); }
  .mapcard svg { display: block; width: 100%; height: auto; }
  `,
  markup: `
  <div class="pad">
    <div class="mapcard">
      <svg viewBox="0 0 330 226" role="img" aria-label="Today's route: a clear midday stretch, one marked crossing where the day's dragon meets the dog in your roots">
        <g fill="none" stroke="var(--line)" stroke-width="1">
          <path d="M-8 44 C36 30 84 16 132 26 C180 36 190 66 156 78 C118 92 52 84 22 66 C4 55 -6 50 -8 44"/>
          <path d="M26 52 C58 40 104 34 128 42 C152 50 152 62 126 68 C96 75 48 68 26 52"/>
          <path d="M198 96 C238 78 292 90 300 120 C308 150 264 172 226 164 C188 156 162 112 198 96"/>
          <path d="M216 108 C244 96 278 106 282 124 C286 142 256 152 232 146 C208 140 196 118 216 108"/>
          <path d="M-8 178 C52 160 116 196 188 186 C248 178 296 194 338 180"/>
          <path d="M-8 206 C70 190 150 214 240 204 C280 200 312 208 338 202"/>
        </g>
        <g transform="translate(14,12)" style="color:var(--mut)"><use href="#orbit-mark"/></g>
        <text x="316" y="24" text-anchor="end" font-size="7.5">TODAY'S TERRAIN</text>
        <path d="M146 72 C160 100 184 162 198 188" fill="none" stroke="var(--er)" stroke-width="1.8" stroke-dasharray="1.5 5" stroke-linecap="round" opacity=".85"/>
        <g transform="translate(138,44) scale(.95)"><use href="#an-dog" fill="var(--er)"/></g>
        <path d="M20 204 C58 196 74 172 94 154 C114 136 146 148 170 132 C194 116 198 88 228 74 C252 63 274 54 292 46" fill="none" stroke="var(--ink)" stroke-width="2.4" stroke-dasharray="7 6" stroke-linecap="round"/>
        <path d="M94 154 C114 136 146 148 170 132" fill="none" stroke="var(--wd)" stroke-width="3.4" stroke-linecap="round"/>
        <rect x="130" y="128" width="4" height="8.5" rx="1.5" fill="var(--wd)" transform="rotate(12 132 132)"/>
        <text x="112" y="122" font-size="7" fill="var(--wd)">CLEAR</text>
        <g transform="translate(212,38) scale(.95)" opacity=".9"><use href="#an-dragon" fill="var(--ink)"/></g>
        <circle cx="171" cy="131" r="9" fill="var(--card)" stroke="var(--er)" stroke-width="1.6"/>
        <path d="M167.5 127.5 L174.5 134.5 M174.5 127.5 L167.5 134.5" stroke="var(--er)" stroke-width="1.8" stroke-linecap="round"/>
        <text x="184" y="146" font-size="7" fill="var(--er)">CLASH</text>
        <circle cx="20" cy="204" r="3.4" fill="var(--mut)"/>
        <text x="32" y="208" font-size="7">MORNING</text>
        <path d="M292 46 L292 28" stroke="var(--ink)" stroke-width="1.8"/>
        <path d="M292 28 L307 32.5 L292 37 Z" fill="var(--wd)"/>
        <text x="306" y="60" text-anchor="end" font-size="7">EVENING</text>
        <circle cx="94" cy="154" r="4.6" fill="var(--ink)"/>
        <rect x="26" y="166" width="88" height="18" rx="9" fill="var(--blk)"/>
        <text x="70" y="178" text-anchor="middle" font-size="7.5" fill="var(--pale)">YOU ARE HERE</text>
        <path d="M256 212 h48 M256 208 v8 M304 208 v8" stroke="var(--mut)" stroke-width="1.4" fill="none"/>
        <text x="280" y="204" text-anchor="middle" font-size="6.5">SCALE · ONE DAY</text>
      </svg>
    </div>
  </div>`,
};

const elevation = {
  slug: 'elevation-profile',
  name: 'Seven-day elevation profile',
  group: 'Trail',
  subtitle: 'The week as terrain, animals as day markers',
  fonts: ['figtree', 'spacemono'],
  height: 380,
  css: `${BASE}
  .elev { background: var(--card); border-radius: var(--radius-card); padding: 12px 8px 8px; box-shadow: var(--sh-card); }
  .elev svg { display: block; width: 100%; height: auto; }
  `,
  markup: `
  <div class="pad">
    <p class="kick">Next 7 days · elevation</p>
    <div class="elev">
      <svg viewBox="0 -8 330 102" role="img" aria-label="Seven-day outlook as an elevation profile; today sits in a quiet dip">
        <path d="M25 70 L25 35.2 L71.7 49.2 L118.3 46.4 L165 54.8 L211.7 29.6 L258.3 29.6 L305 21.2 L305 70 Z" fill="var(--wd-f)" opacity=".45"/>
        <path d="M25 35.2 L71.7 49.2 L118.3 46.4 L165 54.8 L211.7 29.6 L258.3 29.6 L305 21.2" fill="none" stroke="var(--ink)" stroke-width="1.8" stroke-dasharray="5 5" stroke-linejoin="round" stroke-linecap="round"/>
        <path d="M71.7 49.2 V70" stroke="var(--line)" stroke-width="1.4" stroke-dasharray="2 4"/>
        <g transform="translate(17,10.2) scale(.667)" opacity=".72"><use href="#an-rabbit" fill="var(--ink)"/></g>
        <g transform="translate(63.7,24.2) scale(.667)"><use href="#an-dragon" fill="var(--ink)"/></g>
        <g transform="translate(110.3,21.4) scale(.667)" opacity=".6"><use href="#an-snake" fill="var(--ink)"/></g>
        <g transform="translate(157,29.8) scale(.667)" opacity=".42"><use href="#an-horse" fill="var(--ink)"/></g>
        <g transform="translate(203.7,4.6) scale(.667)" opacity=".85"><use href="#an-goat" fill="var(--ink)"/></g>
        <g transform="translate(250.3,4.6) scale(.667)" opacity=".85"><use href="#an-monkey" fill="var(--ink)"/></g>
        <g transform="translate(297,-3.8) scale(.667)"><use href="#an-rooster" fill="var(--ink)"/></g>
        <circle cx="25" cy="35.2" r="3.2" fill="var(--wt)"/>
        <circle cx="71.7" cy="49.2" r="4.4" fill="var(--ink)"/>
        <circle cx="118.3" cy="46.4" r="3.2" fill="var(--card)" stroke="var(--wd)" stroke-width="1.8"/>
        <circle cx="165" cy="54.8" r="3.2" fill="var(--fr)"/>
        <circle cx="211.7" cy="29.6" r="3.2" fill="var(--card)" stroke="var(--fr)" stroke-width="1.8"/>
        <circle cx="258.3" cy="29.6" r="3.2" fill="var(--er)"/>
        <circle cx="305" cy="21.2" r="3.2" fill="var(--card)" stroke="var(--er)" stroke-width="1.8"/>
        <text x="25" y="85.5" text-anchor="middle" font-size="8">TU</text>
        <rect x="60.7" y="75" width="22" height="15" rx="7.5" fill="var(--blk)"/>
        <text x="71.7" y="85.5" text-anchor="middle" font-size="8" fill="var(--pale)">WE</text>
        <text x="118.3" y="85.5" text-anchor="middle" font-size="8">TH</text>
        <text x="165" y="85.5" text-anchor="middle" font-size="8">FR</text>
        <text x="211.7" y="85.5" text-anchor="middle" font-size="8">SA</text>
        <text x="258.3" y="85.5" text-anchor="middle" font-size="8">SU</text>
        <text x="305" y="85.5" text-anchor="middle" font-size="8">MO</text>
      </svg>
    </div>
  </div>`,
};

const waypoints = {
  slug: 'waypoint-rail',
  name: 'Waypoint rail',
  group: 'Trail',
  subtitle: 'Reading sections hung off a dashed route',
  fonts: ['figtree', 'bricolage', 'spacemono'],
  height: 900,
  note: 'Citations sit under the prose they support — the M17 Co-Star rule, carried over intact.',
  css: `${BASE}
  .trail { margin: 4px 0 0 12px; border-left: var(--rail-width) dashed var(--line); padding: 2px 0 2px 28px; }
  .wp { position: relative; padding: 14px 0 10px; }
  .wp .node { position: absolute; left: -47px; top: 12px; width: var(--node-size); height: var(--node-size); border-radius: 999px; background: var(--card); display: grid; place-items: center; box-shadow: var(--sh-node); }
  .wp .node svg { width: 20px; height: 20px; }
  .wp .wcap { margin: 0; font-family: "SpaceMono", ui-monospace, monospace; font-size: 9.5px; font-weight: 700; letter-spacing: .17em; text-transform: uppercase; color: var(--mut); padding-top: 6px; }
  .wp h3 { margin: 4px 0 0; font-family: "Bricolage", "Figtree", sans-serif; font-size: 19px; font-weight: 800; letter-spacing: -.012em; color: var(--ink); }
  .wp p { margin: 9px 0 0; font-size: 14px; line-height: 1.62; color: var(--ink); }
  .wp .cite { margin: 6px 0 2px; font-family: "SpaceMono", ui-monospace, monospace; font-size: 9px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--mut); }
  `,
  markup: `
  <div class="pad">
    <p class="kick">Waypoints · the full route</p>
    <div class="trail">
      <div class="wp">
        <span class="node"><svg viewBox="0 0 24 24" role="img" aria-label="Dog, your roots"><use href="#an-dog" fill="var(--er)"/></svg></span>
        <p class="wcap">Waypoint 01</p>
        <h3>Your roots</h3>
        <p>A trine this year: the year's sign, the horse, joins the dog already in your chart's roots — three friends planning one surprise without a group chat. Support gathers in that room.</p>
        <p class="cite">Horse–dog trine · this year</p>
        <p>A clash today: the day's sign, the dragon, pulls opposite the dog in your chart's roots — a door and a draft. Good weather for cutting a knot you've been avoiding.</p>
        <p class="cite">Dragon–dog clash · today</p>
      </div>
      <div class="wp">
        <span class="node"><svg viewBox="0 0 24 24" role="img" aria-label="Dragon, the day itself"><use href="#an-dragon" fill="var(--wd)"/></svg></span>
        <p class="wcap">Waypoint 02</p>
        <h3>The day itself</h3>
        <p>The old calendars call today a Seven Killings day — pressure that trains you, the coach who makes you run the hill again. Met squarely, it forges rather than breaks.</p>
        <p class="cite">Seven Killings · today</p>
      </div>
      <div class="wp">
        <span class="node"><svg viewBox="0 0 24 24" role="img" aria-label="Horse, this year"><use href="#an-horse" fill="var(--wt)"/></svg></span>
        <p class="wcap">Waypoint 03</p>
        <h3>This year</h3>
        <p>This year lights your Calamity Star — a pothole sign on the road. Not a verdict — just a stretch worth taking slower and double-checking.</p>
        <p class="cite">Calamity Star · this year</p>
      </div>
    </div>
  </div>`,
};

const signs = {
  slug: 'trail-signs',
  name: 'Trail signs',
  group: 'Trail',
  subtitle: 'Favors / Watch as blaze and cairn',
  fonts: ['figtree', 'spacemono'],
  height: 420,
  note: 'Rule 12 still binds: these are "clear trail" and "take it slow", never Do and Don\'t.',
  css: `${BASE}
  .signs { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .sign { border-radius: var(--radius-tile); padding: 14px; background: var(--card); display: grid; gap: 4px; align-content: start; }
  .sign.fav { box-shadow: inset 0 0 0 1.5px var(--wd); }
  .sign.wat { box-shadow: inset 0 0 0 1.5px var(--am); }
  .sign h3 { margin: 0 0 3px; display: flex; align-items: center; gap: 8px; font-family: "SpaceMono", ui-monospace, monospace; font-size: 10px; font-weight: 700; letter-spacing: .13em; text-transform: uppercase; }
  .sign.fav h3 { color: var(--wd); }
  .sign.wat h3 { color: var(--am); }
  .sign h3 svg { width: 17px; height: 17px; flex: none; }
  .sign ul { margin: 0; padding: 0; list-style: none; }
  .sign li { font-size: 12.5px; line-height: 1.5; font-weight: 600; margin-top: 8px; color: var(--ink); }
  .sign li b { display: block; font-weight: 800; }
  `,
  markup: `
  <div class="pad">
    <p class="kick">Trail signs</p>
    <div class="signs">
      <div class="sign fav">
        <h3><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="8.5" y="3.5" width="7" height="7.5" rx="1.5"/><rect x="8.5" y="13" width="7" height="7.5" rx="1.5"/></svg>Clear trail</h3>
        <ul>
          <li><b>Deals · Learning</b>Say yes to the thing you've already half-decided.</li>
          <li><b>The big ask</b>The day carries it further than you'd guess.</li>
        </ul>
      </div>
      <div class="sign wat">
        <h3><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><ellipse cx="12" cy="18.5" rx="7" ry="3"/><ellipse cx="12" cy="13.2" rx="5" ry="2.7"/><ellipse cx="12" cy="8.8" rx="3.3" ry="2.3"/></svg>Take it slow</h3>
        <ul>
          <li><b>Moving · Travel</b>Hold new launches for a smoother day.</li>
          <li><b>Cutting things</b>Aim first, then cut once.</li>
        </ul>
      </div>
    </div>
  </div>`,
};

const signpost = {
  slug: 'signpost-and-nav',
  name: 'Signpost, streak & nav',
  group: 'Trail',
  subtitle: 'The agency line as a directional trail sign',
  fonts: ['figtree', 'spacemono'],
  height: 460,
  note:
    'Both anchors are on this card — the signpost board and the nav pill. Flip to dark and watch them ' +
    'invert to a paper mass: the round-5c rule that the anchor stays the boldest object, not the darkest.',
  css: `${BASE}
  .signpost .board { position: relative; background: var(--blk); color: var(--pale); border-radius: 18px 0 0 18px; margin-right: 20px; padding: 18px 14px 18px 20px; }
  .signpost .board::after { content: ""; position: absolute; left: 100%; top: 0; height: 100%; width: 20px; background: var(--blk); clip-path: polygon(0 0, 100% 50%, 0 100%); }
  .signpost .board .k { margin: 0; font-family: "SpaceMono", ui-monospace, monospace; font-size: 9px; font-weight: 700; letter-spacing: .2em; color: color-mix(in srgb, var(--pale) 55%, var(--mut)); text-transform: uppercase; }
  .signpost .board .t { margin: 7px 0 0; font-size: 16.5px; font-weight: 600; line-height: 1.45; }
  .signpost .board .t em { font-family: ui-serif, "New York", Georgia, serif; font-style: italic; font-weight: 400; }
  .signpost .post { width: 2px; height: 24px; margin: 0 0 0 40px; background: var(--line); }
  .streak { text-align: center; margin: 14px 0 24px; font-family: "SpaceMono", ui-monospace, monospace; font-size: 9.5px; font-weight: 700; letter-spacing: .14em; color: var(--mut); text-transform: uppercase; }
  .nav { width: 100%; background: var(--blk); border-radius: 999px; display: flex; padding: 10px 8px; box-shadow: var(--sh-nav); }
  .nav span { flex: 1; text-align: center; font-size: 10.5px; font-weight: 700; color: color-mix(in srgb, var(--pale) 40%, var(--mut)); }
  .nav span.on { color: var(--pale); }
  `,
  markup: `
  <div class="pad">
    <div class="signpost">
      <div class="board">
        <p class="k">One small thing before camp</p>
        <p class="t">Call a family member you've been <em>meaning to reach</em>.</p>
      </div>
      <div class="post"></div>
    </div>
    <p class="streak">Day 47 on the trail — see you tomorrow</p>
    <nav class="nav" aria-hidden="true">
      <span class="on">Today</span><span>Chart</span><span>Cycles</span><span>People</span><span>Dates</span>
    </nav>
  </div>`,
};

export const TRAIL_CARDS = [
  datebar,
  headline,
  legend,
  mapHero,
  elevation,
  waypoints,
  signs,
  signpost,
];
