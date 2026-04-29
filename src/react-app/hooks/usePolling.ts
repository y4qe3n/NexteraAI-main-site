import { useCallback, useEffect, useRef, useState } from "react";

interface UsePollingOptions<T> {
  /** Polling interval in milliseconds. Defaults to 30 s. */
  intervalMs?: number;
  /** Optional fallback returned when the fetcher throws. */
  fallback?: T;
  /** Skip polling entirely (still does a one-shot fetch on mount). */
  pollEnabled?: boolean;
  /** Extra dependencies that should trigger an immediate refetch. */
  deps?: ReadonlyArray<unknown>;
}

interface PollingResult<T> {
  data: T | null;
  loading: boolean;
  error: unknown;
  /** Marks whether the most recent value came from the live API (true) or the fallback (false). */
  isLive: boolean;
  refresh: () => void;
}

/**
 * Tab-visibility-aware polling hook. Pauses while the tab is hidden and
 * resumes immediately on focus. On any error it falls back to the supplied
 * `fallback` value so consumers always have something to render.
 */
export function usePolling<T>(
  fetcher: () => Promise<T>,
  {
    intervalMs = 30_000,
    fallback,
    pollEnabled = true,
    deps = [],
  }: UsePollingOptions<T> = {}
): PollingResult<T> {
  const [data, setData] = useState<T | null>(fallback ?? null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [isLive, setIsLive] = useState(false);
  const cancelledRef = useRef(false);

  const run = useCallback(async () => {
    try {
      const value = await fetcher();
      if (cancelledRef.current) return;
      setData(value);
      setIsLive(true);
      setError(null);
    } catch (err) {
      if (cancelledRef.current) return;
      setError(err);
      setIsLive(false);
      if (fallback !== undefined) {
        setData(fallback);
      }
    } finally {
      if (!cancelledRef.current) setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher, fallback]);

  useEffect(() => {
    cancelledRef.current = false;
    void run();

    if (!pollEnabled) return () => undefined;

    let timer: ReturnType<typeof setInterval> | null = setInterval(run, intervalMs);

    const onVisibility = () => {
      if (document.hidden) {
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
      } else {
        void run();
        if (!timer) timer = setInterval(run, intervalMs);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelledRef.current = true;
      if (timer) clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run, intervalMs, pollEnabled, ...deps]);

  return { data, loading, error, isLive, refresh: run };
}
