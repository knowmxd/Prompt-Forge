import { useEffect, useState } from "react";
import {
  getCachedPoseManifest,
  loadPoseManifest,
  type PoseManifestItem,
} from "./pose-manifest";

export function usePoseManifest(enabled = true) {
  const [poses, setPoses] = useState<PoseManifestItem[]>(() => getCachedPoseManifest() ?? []);
  const [loading, setLoading] = useState<boolean>(() => enabled && !getCachedPoseManifest());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const cached = getCachedPoseManifest();
    if (cached) {
      setPoses(cached);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    loadPoseManifest()
      .then((items) => {
        if (cancelled) return;
        setPoses(items);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load pose library");
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return { poses, loading, error };
}
