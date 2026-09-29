/**
 * Instrument (stored id `dial`) — Look C, "Day dial" (M19.9-01).
 * A 24-hour ring, noon at the top, morning left and evening right (the same
 * left-to-right day as Explorer's route), with the twelve two-hour animals
 * round the rim the way the almanac counts the day.
 */

import { LOOK_BASE, animal, label } from './look-shared.mjs';

const C = 170;
const angleOf = (hour) => ((hour - 12) / 24) * Math.PI * 2 - Math.PI / 2;
const polar = (hour, radius) => [C + Math.cos(angleOf(hour)) * radius, C + Math.sin(angleOf(hour)) * radius];
const arc = (from, to, radius) => {
  const [x1, y1] = polar(from, radius);
  const [x2, y2] = polar(to, radius);
  const span = (to - from + 24) % 24;
  return `M${x1.toFixed(2)},${y1.toFixed(2)}A${radius},${radius} 0 ${span > 12 ? 1 : 0} 1 ${x2.toFixed(2)},${y2.toFixed(2)}`;
};

/** Double-hours in order from 11pm; index × 2 is each block's centre hour. */
const HOURS = ['rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake', 'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig'];
const LIT = {
  rat: { ring: 'var(--am)', fill: 'var(--am-f)' },
  goat: { ring: 'var(--wd)', fill: 'var(--wd-f)' },
  snake: { ring: 'var(--ink)', fill: 'var(--card)' },
};

function dial() {
  const ticks = Array.from({ length: 24 }, (_, hour) => {
    const major = hour % 6 === 0;
    const [x1, y1] = polar(hour, 100);
    const [x2, y2] = polar(hour, major ? 90 : 95);
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${major ? 'var(--ink)' : 'var(--line)'}" stroke-width="${major ? 2 : 1.4}" stroke-linecap="round"/>`;
  }).join('');
  const cardinals = [[12, 'NOON'], [18, '6 PM'], [0, 'MIDNIGHT'], [6, '6 AM']]
    .map(([hour, text]) => {
      const [x, y] = polar(hour, 76);
      return label(text, x, y + 3, { size: 8.5, anchor: 'middle', spacing: 1 });
    })
    .join('');
  const rim = HOURS.map((name, i) => {
    const [x, y] = polar(i * 2, 154);
    const lit = LIT[name];
    const halo = lit ? `<circle cx="${x}" cy="${y}" r="15" fill="${lit.fill}" stroke="${lit.ring}" stroke-width="1.8"/>` : '';
    return `${halo}<g opacity="${lit ? 1 : 0.42}">${animal(name, x, y, lit ? 18 : 16, 'var(--ink)')}</g>`;
  }).join('');
  const hand = (angleOf(10 + 40 / 60) * 180) / Math.PI;
  return `
    <circle cx="${C}" cy="${C}" r="118" fill="none" stroke="var(--line)" stroke-opacity=".5" stroke-width="16"/>
    <path d="${arc(6, 18, 118)}" fill="none" stroke="var(--line)" stroke-width="16"/>
    ${ticks}${cardinals}
    <path d="${arc(13, 15, 118)}" fill="none" stroke="var(--wd)" stroke-width="16" stroke-linecap="round"/>
    <path d="${arc(23, 1, 118)}" fill="none" stroke="var(--am)" stroke-width="16" stroke-linecap="round"/>
    ${rim}
    <g transform="rotate(${hand} ${C} ${C})">
      <line x1="${C + 64}" y1="${C}" x2="${C + 128}" y2="${C}" stroke="var(--blk)" stroke-width="3" stroke-linecap="round"/>
      <circle cx="${C + 118}" cy="${C}" r="9" fill="var(--blk)" stroke="var(--bg)" stroke-width="3"/>
    </g>
    <circle cx="${C}" cy="${C}" r="58" fill="var(--card)"/>
    ${animal('horse', C, C - 8, 50, 'var(--ink)')}
    ${label('NOW 10:40', C, C + 32, { size: 8.5, anchor: 'middle', spacing: 1.2 })}`;
}

const dayDial = {
  slug: 'day-dial',
  name: 'Day dial',
  group: 'Instrument',
  subtitle: 'Twenty-four hours, twelve animals, the easy and rough hours as arcs',
  fonts: ['figtree', 'spacemono'],
  height: 440,
  note:
    'Instrument’s signature object. Lit animals: the rough hour (amber), the easy hour (wood), the hour ' +
    'you are in (ink ring). The hand is the anchor pair. Arrival: the arcs draw, the hand sweeps to now.',
  css: `${LOOK_BASE}
  .dial { display: block; width: 100%; max-width: 330px; margin: 0 auto; overflow: visible; }
  `,
  markup: `
  <svg class="dial" viewBox="-12 -12 364 364" role="img" aria-label="Today's hours: easy 1 to 3 pm, rough 11 pm to 1 am, now 10:40 am">${dial()}</svg>`,
};

const WEEK = [['Tue', '29', 'today'], ['Wed', '30', 'up'], ['Thu', '1', ''], ['Fri', '2', 'up'], ['Sat', '3', 'down'], ['Sun', '4', 'up'], ['Mon', '5', 'up']];

const weekAndHours = {
  slug: 'week-rings-and-hours',
  name: 'Week rings & hour legend',
  group: 'Instrument',
  subtitle: 'The week as seven tone rings; the two hours in words',
  fonts: ['figtree', 'bricolage', 'spacemono'],
  height: 420,
  note: 'Ring tone: solid wood = the day leans your way, dashed amber = take it slow, plain = even. Today is the anchor pair.',
  css: `${LOOK_BASE}
  .week { display: flex; justify-content: space-between; }
  .day { width: 42px; display: flex; flex-direction: column; align-items: center; gap: 6px; }
  .day i { width: 38px; height: 38px; border-radius: 50%; border: 2.5px solid var(--line); display: grid; place-items: center; font-family: "SpaceMono", ui-monospace, monospace; font-size: 11px; font-weight: 700; font-style: normal; color: var(--ink); }
  .day i.up { border-color: var(--wd); }
  .day i.down { border-color: var(--am); border-style: dashed; }
  .day i.today { background: var(--blk); color: var(--pale); border-color: var(--blk); }
  .day .mono { font-size: 8.5px; letter-spacing: .1em; color: var(--mut); }
  .legend { display: flex; flex-direction: column; gap: 2px; }
  .row { background: var(--card); padding: 15px 18px; min-height: 64px; display: grid; grid-template-columns: 30px 1fr; gap: 2px 0; align-items: center; }
  .row:first-child { border-radius: 20px 20px 6px 6px; }
  .row:last-child { border-radius: 6px 6px 20px 20px; }
  .row .sw { grid-row: 1 / span 2; width: 22px; height: 8px; border-radius: 99px; }
  .row .mono { color: var(--mut); }
  .row b { font-family: "Bricolage", "Figtree", sans-serif; font-size: 17px; font-weight: 800; letter-spacing: -.01em; color: var(--ink); }
  `,
  markup: `
  <div class="pad">
    <div class="week">${WEEK.map(([name, day, tone]) => `<div class="day"><i class="${tone}">${day}</i><span class="mono">${name}</span></div>`).join('')}</div>
    <div class="legend">
      <div class="row"><span class="sw" style="background:var(--wd)"></span><span class="mono">Easy · 1–3 pm · goat hour</span><b>Runs with the day. Settle something.</b></div>
      <div class="row"><span class="sw" style="background:var(--am)"></span><span class="mono">Rough · 11 pm–1 am · rat hour</span><b>Runs against it. Give it slack.</b></div>
    </div>
  </div>`,
};

export const INSTRUMENT_CARDS = [dayDial, weekAndHours];
