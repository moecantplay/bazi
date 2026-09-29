/**
 * Stand-in for the Umami tracker in E2E builds (M19.8-06). `pnpm build:e2e`
 * points NEXT_PUBLIC_ANALYTICS_SCRIPT_URL here and static-server.mjs serves
 * this file at /__e2e/analytics.js. It records every call instead of sending
 * anything. A page view is recorded with the url Umami would have sent after
 * the app's override — the base props deliberately carry the full href, so a
 * missing override shows up as a query or fragment in the recorded url.
 */
window.__analyticsCalls = window.__analyticsCalls || [];
window.__analyticsScript = document.currentScript
  ? Object.fromEntries(
      Array.from(document.currentScript.attributes).map((attribute) => [attribute.name, attribute.value])
    )
  : null;
window.umami = {
  track(nameOrOverride, data) {
    if (typeof nameOrOverride === "function") {
      const payload = nameOrOverride({ url: window.location.href, title: document.title, website: "e2e" });
      window.__analyticsCalls.push({ pageview: payload.url });
      return;
    }
    window.__analyticsCalls.push({ name: nameOrOverride, data: data ?? null });
  }
};
