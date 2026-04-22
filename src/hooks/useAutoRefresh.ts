"use client";

import { useEffect, useEffectEvent } from "react";

type RefreshOptions = {
  enabled?: boolean;
  intervalMs?: number;
  refreshOnFocus?: boolean;
  runOnMount?: boolean;
};

export default function useAutoRefresh(
  refresh: () => Promise<void> | void,
  options: RefreshOptions = {},
) {
  const {
    enabled = true,
    intervalMs = 10000,
    refreshOnFocus = true,
    runOnMount = true,
  } = options;

  const refreshEvent = useEffectEvent(() => {
    void refresh();
  });

  useEffect(() => {
    if (!enabled) {
      return;
    }

    if (runOnMount) {
      refreshEvent();
    }

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        refreshEvent();
      }
    }, intervalMs);

    if (!refreshOnFocus) {
      return () => {
        window.clearInterval(intervalId);
      };
    }

    const handleFocus = () => {
      refreshEvent();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshEvent();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [enabled, intervalMs, refreshOnFocus, runOnMount]);
}
