# Research notes — PROGRESS.md flags follow-up (2026-07-14)

Sub-agent web research resuming the three open flags in PROGRESS.md ("Flags / unverifiable values").
Status: 神煞 and day-officer reports complete; 命宮/身宮 report pending.

## 1. 神煞 學堂 / 詞館 / 血刃 — CONFIRMED: keep omitted

Targets (reference app, Fixture A): 學堂@卯, 詞館@申, 血刃@戌.
Six documented rule variants tested, each corroborated by 2+ independent sources; **none reproduces the targets**.

- 學堂: na-yin/year-pillar method (fire→寅) and Ziping day-stem 長生 (戊→寅 or 申 depending on 火土同宗 vs 水土同宮). Neither = 卯 (卯 is uniquely 癸's 長生).
  Sources: sf280.com/bazililun/shenshalunming/162.html; fatemaster.ai/en/guides/shensha/xue-tang
- 詞館: na-yin 臨官 (fire→巳); Ziping day-stem 臨官 (戊→巳 or 亥). Neither = 申. 申 is 庚's 臨官 — matches only if keyed off the HOUR stem, which no source documents; treated as coincidence.
  Sources: fatemaster.ai/en/guides/shensha/ci-guan
- 血刃: day-stem table (戊→午, = 祿前一位, internally consistent) and month-branch table (子→午). Both independent variants agree with each other (午) and jointly contradict the app's 戌 (戌 would need day stem 辛 or month branch 酉).
  Sources: m.smxs.com/mingli/bzzs/135612.html; services.shen88.cn/bazisuanming/bazirumen-10398.html; 163.com/dy/article/G72V8P460532D4MK.html; m.k366.com/bazi/216727.htm; fatemaster.ai/en/guides/shensha/xue-ren

Conclusion: the reference app likely uses a proprietary/non-classical keying. Unblock = the app's own methodology screen, or more example charts to triangulate. PROGRESS.md flag stands, now positively confirmed rather than merely unresolved.

## 2. Day-officer 宜/忌 table — consensus audit (8 sources beyond the 2 originally cited)

Sources: gdzaofutang.com/h-nd-195.html; absolutelyfengshui.com 12-day-officers pt1+pt2; fengshuied.com/12-day-stars; skillon.com topic/90; zh.wikipedia 建除十二神; sohu.com/a/727671351_121819358; aggregated Chinese folk-almanac synthesis (suanzhun.net, zhihu, sldtswh.com) + masterso.com live 2026-07-14 (破 day, 宜"祭祀 破屋壞垣" — word-for-word match to our "clear" label).
Independence caveat: fengshuied ≈ skillon (shared wording) — count as ~1.5 votes. Rejected source: easternfortune.ai (omits 成 entirely, inverts 危 — unreliable). Blocked: ctext.org (CAPTCHA), baike.baidu (403).

Golden fixture: 2026-06-21 = 成 day RECONFIRMED consistent across all sources; no source contradicts the Sinarmas favors.

Recommended table changes, ranked:
1. HIGH — 定 (Ding): add `travel` (and likely `move`) to avoids. 3–4 independent sources (gdzaofutang, absolutelyfengshui, fengshuied, sohu); our table currently asserts no avoids for 定. Strongest finding of the audit.
2. HIGH — 成 (Cheng): add `ask` to favors (2 Chinese sources: 上任). Reinforces the golden day.
3. MOD-HIGH — 閉 (Bi): add `study` to avoids (忌"求医问学"); consider `ask` too. Existing broad avoids independently confirmed by 2 full Chinese tables.
4. MOD — 開 (Kai): add `commit` and `ask` to favors (3 sources each).
5. MOD — 滿 (Man): add `commit` to favors (3 sources); add `clear` to avoids (2 sources, uncontested).
6. FLAG-AS-CONTESTED — 執 (Zhi): `launch` actively disputed (gdzaofutang 不宜开业 + sohu 忌开市 vs absolutelyfengshui favor); our table currently sides with the minority. 滿 `move` also disputed (3 English favor vs sohu 忌移徙) — do NOT add.
7. No action: 建/破/危/收 favors all corroborated; 破's broad avoids hold; several 除/收 single-source avoid signals too weak to act on.

Activity-set note: nearly every source treats 求醫 (medical) as a major category; our activity set doesn't model it (deliberate per M13 scope, but worth a product-owner decision).

Unconfirmed-but-uncontradicted entries (sole support = original 2 cited sources): 除 rest, 平 gather, 定 study, 危 rest, 開 study/gather, 閉 rest.

## 3. 命宮/身宮 — RESOLVED: one dominant mainstream formula, implementable

Unlike the officer table, no genuine competing lineages found — cross-source differences were paraphrase noise. The near-universal formula is the 14/26 shortcut of the classical counting rule from 三命通會 卷二〈論坐命宮〉(萬民英); verified against three independently-sourced fully-worked examples (bazipai-style summaries, kknews/Wikipedia-cited example, doppia2.pixnet, ppfocus).

Formula (reuses existing engine tables only — JIE monthOrdinal, FIVE_TIGERS, stem/branch indexes):
1. 代支數(b) = monthOrdinal(b) + 1 (寅=1 … 丑=12).
2. m = 代支數(month branch), h = 代支數(hour branch).
3. 命宮支數 = 14 − (m+h) if m+h < 14, else 26 − (m+h); map back to a branch.
4. 命宮 stem via 五虎遁 from the year stem, exactly like monthPillar().
5. 身宮 mirrors it with addition: 身宮支數 = (m+h), −12 if >12; same stem mechanism. (Caveat: no fully-worked third-party numeric example found for 身宮 specifically — the mirrored formula is repeated everywhere but deserves a second confirmation before it's tested as a graded feature.)

中氣 refinement (cited independently 3×): "推命宮以氣為主，如過中氣即作下月計算" — births after the month's 中氣 use the next month's 代支數 (the month *pillar* still follows 節). Real but not free: data/solar-terms.json holds only the 12 節, no 中氣 terms, so implementing it means extending the generator. Recommendation: ship the 節-only base formula, log the 中氣 nuance as a documented-but-unimplemented flag (same treatment as the EoT/Meeus exception).

Fixture A (1994-12-08 16:30 Asia/Jakarta; month 子 m=11, hour 申 h=7; birth is ~2 weeks before 冬至 so the 中氣 refinement changes nothing here):
- 命宮 = 癸酉 (26−18=8→酉; FIVE_TIGERS[甲]=丙, stemAt(2+7)=癸)
- 身宮 = 辛未 (18−12=6→未; stemAt(2+5)=辛)

No golden value exists from the reference app (its 命身胎息 tab wasn't in the screenshot), so these computed values can't be externally confirmed yet — but the formula itself is well-attested. Blocked from reverse-engineering zhouyi.cc / astrology.tw calculators (403s).

Recommendation: implementable now as the defensible mainstream variant; the PROGRESS.md "no golden value" concern is softened (formula is dominant, not school-split) though a reference-app value for Fixture A would still be the ideal confirmation.
