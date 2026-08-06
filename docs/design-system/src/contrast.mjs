/**
 * WCAG 2.1 relative-luminance contrast, used two ways:
 *   - at build time, to bake real ratios into the palette card
 *   - by check-contrast.mjs, to gate the whole bundle
 *
 * Round 5c's lesson was that contrast has to be measured on rendered pairs, not
 * asserted from a token table — and that light mode is the side that fails.
 */

/** Parse `#RGB`, `#RRGGBB`, or `rgba(r,g,b,a)` into {r,g,b,a} with 0-255 channels. */
export function parseColor(value) {
  const text = String(value).trim();

  const rgba = text.match(/^rgba?\(([^)]+)\)$/i);
  if (rgba) {
    const parts = rgba[1].split(',').map((p) => parseFloat(p.trim()));
    return { r: parts[0], g: parts[1], b: parts[2], a: parts.length > 3 ? parts[3] : 1 };
  }

  const hex = text.replace('#', '');
  if (hex.length === 3) {
    return {
      r: parseInt(hex[0] + hex[0], 16),
      g: parseInt(hex[1] + hex[1], 16),
      b: parseInt(hex[2] + hex[2], 16),
      a: 1,
    };
  }
  if (hex.length === 6) {
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
      a: 1,
    };
  }
  throw new Error(`Cannot parse colour: ${value}`);
}

/** Composite a possibly-translucent colour over an opaque backdrop. */
export function flatten(color, backdrop) {
  const top = parseColor(color);
  if (top.a >= 1) return top;
  const under = parseColor(backdrop);
  return {
    r: top.r * top.a + under.r * (1 - top.a),
    g: top.g * top.a + under.g * (1 - top.a),
    b: top.b * top.a + under.b * (1 - top.a),
    a: 1,
  };
}

function luminance({ r, g, b }) {
  const channel = (value) => {
    const c = value / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** Contrast ratio between a foreground and an opaque background. */
export function ratio(foreground, background) {
  const fg = luminance(flatten(foreground, background));
  const bg = luminance(parseColor(background));
  const [light, dark] = fg > bg ? [fg, bg] : [bg, fg];
  return (light + 0.05) / (dark + 0.05);
}

/** Round the way a report should read — never round 4.49 up to a passing 4.5. */
export function report(foreground, background) {
  return Math.floor(ratio(foreground, background) * 100) / 100;
}

export const AA_BODY = 4.5;
export const AA_LARGE = 3;
