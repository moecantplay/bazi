/**
 * Explorer (stored id `trail`) — Look A, "Trail, distilled" (M19.9-01).
 * The map is the first screen: date, headline and terrain on one surface, and
 * a route from morning to evening carrying only the two timed marks.
 */

import { HEADLINE, LOOK_BASE, animal, label } from './look-shared.mjs';

/** Wobbly closed contour around (cx, cy). */
function contour(cx, cy, radius, phase) {
  const points = [];
  for (let i = 0; i <= 72; i++) {
    const angle = (i / 72) * Math.PI * 2;
    const wobble = 1 + 0.13 * Math.sin(3 * angle + phase) + 0.07 * Math.sin(5 * angle + phase * 1.7);
    points.push(`${(cx + Math.cos(angle) * radius * wobble * 1.25).toFixed(1)},${(cy + Math.sin(angle) * radius * wobble).toFixed(1)}`);
  }
  return `M${points.join('L')}Z`;
}

function topo() {
  const sets = [[320, 110, 9], [50, 470, 7], [210, 300, 4]];
  return sets
    .flatMap(([cx, cy, rings], set) =>
      Array.from({ length: rings }, (_, k) =>
        `<path d="${contour(cx, cy, 22 + k * 24, set * 1.3 + k * 0.45)}" fill="none" stroke="var(--line)" stroke-opacity=".55" stroke-width="${k % 4 === 3 ? 1.6 : 1}"/>`,
      ),
    )
    .join('');
}

/** The route climbs from MORNING (6am, left) to EVENING (10pm, right). */
const routeY = (x) => {
  const t = (x - 24) / 342;
  return 205 - t * 150 + 12 * Math.sin(t * Math.PI * 2.2);
};
const hourX = (hour) => 24 + ((hour - 6) / 16) * 342;
const routePath = (from, to) => {
  let d = '';
  for (let x = from; x <= to; x += 3) d += `${d ? 'L' : 'M'}${x.toFixed(1)},${routeY(x).toFixed(1)}`;
  return d;
};

function route() {
  const nowX = hourX(10 + 40 / 60);
  const nowY = routeY(nowX);
  const easyX = hourX(14);
  const easyY = routeY(easyX);
  const roughX = 318;
  const roughY = routeY(roughX);
  const endY = routeY(366);
  return `
    <path d="${routePath(24, 366)}" fill="none" stroke="var(--ink)" stroke-width="2.2" stroke-dasharray="6 6"/>
    <path d="${routePath(24, nowX)}" fill="none" stroke="var(--ink)" stroke-width="4" stroke-linecap="round"/>
    ${label('MORNING', 20, 236)}
    <path d="M366 ${endY}V${endY - 30}l16 7-16 7" fill="var(--ink)" stroke="var(--ink)" stroke-width="2" stroke-linejoin="round"/>
    ${label('EVENING', 356, endY - 22, { anchor: 'end' })}
    <circle cx="${easyX}" cy="${easyY}" r="17" fill="var(--wd-f)" stroke="var(--wd)" stroke-width="2"/>
    ${animal('goat', easyX, easyY, 20, 'var(--ink)')}
    ${label('EASY · 1–3 PM', easyX - 24, easyY - 12, { size: 9.5, fill: 'var(--ink)', anchor: 'end' })}
    <circle cx="${roughX}" cy="${roughY}" r="17" fill="var(--am-f)" stroke="var(--am)" stroke-width="2"/>
    ${animal('rat', roughX, roughY, 18, 'var(--ink)')}
    <path d="M${roughX + 9} ${roughY - 21}l8 8m0-8l-8 8" stroke="var(--am)" stroke-width="2.4" stroke-linecap="round"/>
    ${label('ROUGH · 11 PM–1 AM', roughX - 24, roughY - 10, { size: 9.5, fill: 'var(--ink)', anchor: 'end' })}
    <circle cx="${nowX}" cy="${nowY}" r="21" fill="var(--blk)"/>
    ${animal('horse', nowX, nowY, 24, 'var(--pale)')}
    <rect x="${nowX - 34}" y="${nowY + 28}" width="68" height="20" rx="10" fill="var(--blk)"/>
    ${label('NOW 10:40', nowX, nowY + 41.5, { size: 8.5, fill: 'var(--pale)', anchor: 'middle', spacing: 0.8 })}`;
}

const routeHero = {
  slug: 'route-hero',
  name: 'Route hero',
  group: 'Explorer',
  subtitle: 'Date, headline and the day’s route on one terrain',
  fonts: ['figtree', 'bricolage', 'spacemono'],
  height: 560,
  note:
    'Explorer’s signature object. The solid stretch is the part of the day already walked; only the two ' +
    'timed marks ride the route, each labelled up and to the left, where the climbing line never is. ' +
    'Arrival: contours fade, the route draws left to right, marks pop in order.',
  css: `${LOOK_BASE}
  .hero { position: relative; height: 468px; overflow: hidden; }
  .hero .topo { position: absolute; inset: 0; width: 100%; height: 100%; }
  .hero .top { position: relative; display: flex; justify-content: space-between; padding: 14px 20px 0; color: var(--mut); }
  .hero .hl { position: relative; padding: 18px 20px 0; font-size: 38px; }
  .hero .route { position: absolute; left: 0; right: 0; bottom: 0; width: 100%; height: auto; overflow: visible; }
  `,
  markup: `
  <div class="hero">
    <svg class="topo" viewBox="0 0 390 468" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${topo()}</svg>
    <div class="top mono"><span>Tue 29 Sep</span><span>Yang fire · horse day</span></div>
    <h1 class="hl">${HEADLINE}</h1>
    <svg class="route" viewBox="0 0 390 250" role="img" aria-label="Today's route: now 10:40, easy hour 1 to 3 pm, rough hour 11 pm to 1 am">${route()}</svg>
  </div>`,
};

const furtherCards = {
  slug: 'further-along',
  name: 'Further along',
  group: 'Explorer',
  subtitle: 'The rest of the reading as swipe cards, one idea each',
  fonts: ['figtree', 'bricolage', 'spacemono'],
  height: 420,
  note: 'Replaces the four-section waypoint rail. Each card says something the first screen didn’t; the swipe is the "go deeper".',
  css: `${LOOK_BASE}
  .cards { display: flex; gap: 12px; overflow-x: auto; scroll-snap-type: x mandatory; padding: 4px 20px 14px; scrollbar-width: none; }
  .cards::-webkit-scrollbar { display: none; }
  .card { flex: 0 0 272px; scroll-snap-align: start; background: var(--card); border-radius: var(--radius-card); box-shadow: var(--sh-card); padding: 18px; display: flex; flex-direction: column; gap: 10px; }
  .card h3 { margin: 0; font-family: "Bricolage", "Figtree", sans-serif; font-size: 19px; line-height: 1.2; font-weight: 800; letter-spacing: -.012em; color: var(--ink); }
  .card p { margin: 0; font-size: 14.5px; line-height: 1.6; color: var(--ink); }
  .card .mono { display: flex; align-items: center; gap: 8px; color: var(--mut); }
  .card .mono svg { width: 18px; height: 18px; }
  `,
  markup: `
  <div class="pad" style="gap:12px"><span class="mono mut">— Further along · swipe</span></div>
  <div class="cards">
    <article class="card"><span class="mono"><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#an-dog" fill="var(--ink)"/></svg>Roots · trine</span><h3>Support gathers at home</h3><p>The horse joins the dog already in your roots. Three friends planning one surprise without a group chat.</p><span class="cite">horse–dog trine · roots</span></article>
    <article class="card"><span class="mono"><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#an-goat" fill="var(--ink)"/></svg>The hours</span><h3>Easy at one, rough near midnight</h3><p>The goat hour runs with the day, a fair time to settle something. The rat hour runs against it, so give what lands some slack.</p><span class="cite">goat 1–3 pm · rat 11 pm–1 am</span></article>
  </div>`,
};

export const EXPLORER_CARDS = [routeHero, furtherCards];
