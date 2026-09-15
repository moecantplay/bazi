/**
 * Stand-in condition glyphs for the twelve Day Officers, used by the
 * Conditions screen (/conditions/). Fine-line 24×24 strokes in the same
 * grammar as the element set, drawn as placeholders so the weather rhythm
 * can be judged on device; a bespoke set (traced like the zodiac silhouettes)
 * replaces these if the screen is kept. Keyed by the engine's officer key.
 */

const SUN_CORE = ["M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8"];
const SUN_RAYS = ["M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"];
const CLOUD_LOW = "M7 16h10a4 4 0 0 0 .5-8A6 6 0 0 0 6 9.5 3.3 3.3 0 0 0 7 16z";
const HORIZON = "M3 17h18";
const HALF_SUN = "M6 17a6 6 0 0 1 12 0";

export const CONDITION_ICON_PATHS: Record<string, readonly string[]> = {
  // 滿 Full — clear, generous
  man: [...SUN_CORE, ...SUN_RAYS],
  // 成 Success — clear with the work coming together
  cheng: [...SUN_CORE, "M12 3v2M12 19v2M3 12h2M19 12h2", "M6 6l1.5 1.5M16.5 16.5L18 18M6 18l1.5-1.5M16.5 7.5L18 6"],
  // 平 Balance — the level road
  ping: ["M4 15h16", "M12 15a5 5 0 0 1 5-5 5 5 0 0 1 5 5", "M2 15a5 5 0 0 1 5-5 5 5 0 0 1 5 5"],
  // 定 Stable — a still cloud
  ding: ["M7 18h10a4 4 0 0 0 .5-8A6 6 0 0 0 6 11.5 3.3 3.3 0 0 0 7 18z"],
  // 執 Hold — haze, a grip that holds
  zhi: ["M4 17c2-2 4-2 6 0s4 2 6 0 4-2 6 0", "M4 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0", "M4 7c2-2 4-2 6 0s4 2 6 0 4-2 6 0"],
  // 破 Break — lightning
  po: [CLOUD_LOW, "M13 12l-2 4h3l-2 4"],
  // 危 Danger — rain
  wei: ["M7 15h10a4 4 0 0 0 .5-8A6 6 0 0 0 6 8.5 3.3 3.3 0 0 0 7 15z", "M8 18l-1 3M12 18l-1 3M16 18l-1 3"],
  // 收 Receive — sunset, gathering in
  shou: [HORIZON, HALF_SUN, "M12 5v3M5 9l2 2M19 9l-2 2"],
  // 開 Open — sunrise
  kai: [HORIZON, HALF_SUN, "M12 3v3M4 7l2 2M20 7l-2 2M9 4l1 2M15 4l-1 2"],
  // 建 Establish — a stake with a flag
  jian: ["M5 21V4", "M5 5h11l-3 3 3 3H5", "M3 21h6"],
  // 除 Remove — wind, sweeping out
  chu: ["M3 8h11a3 3 0 1 0-3-3", "M3 13h15a3 3 0 1 1-3 3", "M3 18h7"],
  // 閉 Close — moon, shutters drawn
  bi: ["M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"]
};
