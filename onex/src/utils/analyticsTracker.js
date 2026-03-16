import api from "./api";

const SESSION_KEY = "analytics_session_id";
const HEARTBEAT_SECONDS = 15;

function getSessionId() {
  const existing = sessionStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const generated = `s_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  sessionStorage.setItem(SESSION_KEY, generated);
  return generated;
}

function sendEvent(payload) {
  api.post("/analytics/track", payload).catch(() => {
    // Best effort analytics tracking; failures are intentionally non-blocking.
  });
}

let isHistoryPatched = false;

function patchHistoryEvents() {
  if (isHistoryPatched || typeof window === "undefined") return;
  isHistoryPatched = true;

  const originalPush = window.history.pushState;
  const originalReplace = window.history.replaceState;

  window.history.pushState = function pushStatePatched(...args) {
    const result = originalPush.apply(this, args);
    window.dispatchEvent(new Event("app:navigation"));
    return result;
  };

  window.history.replaceState = function replaceStatePatched(...args) {
    const result = originalReplace.apply(this, args);
    window.dispatchEvent(new Event("app:navigation"));
    return result;
  };
}

export function startAnalyticsTracking() {
  if (typeof window === "undefined") return () => {};

  patchHistoryEvents();
  const sessionId = getSessionId();
  let currentPath = `${window.location.pathname}${window.location.search}`;
  let lastVisibleTs = document.visibilityState === "visible" ? Date.now() : null;

  sendEvent({ eventType: "page_view", sessionId, pagePath: currentPath });

  const onNavigation = () => {
    const nextPath = `${window.location.pathname}${window.location.search}`;
    if (nextPath === currentPath) return;
    currentPath = nextPath;
    sendEvent({ eventType: "page_view", sessionId, pagePath: currentPath });
  };

  const onVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      lastVisibleTs = Date.now();
      return;
    }

    if (!lastVisibleTs) return;
    const activeSeconds = Math.max(0, Math.round((Date.now() - lastVisibleTs) / 1000));
    lastVisibleTs = null;

    if (activeSeconds > 0) {
      sendEvent({
        eventType: "heartbeat",
        sessionId,
        pagePath: currentPath,
        activeSeconds,
      });
    }
  };

  const heartbeatId = window.setInterval(() => {
    if (document.visibilityState !== "visible" || !lastVisibleTs) return;
    const now = Date.now();
    const activeSeconds = Math.max(0, Math.round((now - lastVisibleTs) / 1000));
    if (activeSeconds > 0) {
      sendEvent({
        eventType: "heartbeat",
        sessionId,
        pagePath: currentPath,
        activeSeconds,
      });
      lastVisibleTs = now;
    }
  }, HEARTBEAT_SECONDS * 1000);

  window.addEventListener("popstate", onNavigation);
  window.addEventListener("app:navigation", onNavigation);
  document.addEventListener("visibilitychange", onVisibilityChange);

  return () => {
    window.clearInterval(heartbeatId);
    window.removeEventListener("popstate", onNavigation);
    window.removeEventListener("app:navigation", onNavigation);
    document.removeEventListener("visibilitychange", onVisibilityChange);
  };
}
