/**
 * OPTIONAL: Offline Queue Cleanup Utility
 * 
 * Use this utility for automatic cleanup of corrupted offline queue on app startup.
 * This is optional and can be called once on app initialization.
 * 
 * Why: Ensures that any existing corrupted state from previous app versions
 * doesn't affect the current deployment.
 */

export function cleanupCorruptedOfflineQueue(): {
  cleaned: boolean;
  error?: string;
} {
  if (typeof window === 'undefined') {
    return { cleaned: false, error: 'Not running in browser' };
  }

  try {
    const QUEUE_KEY = 'agrilink_offline_queue';
    const existingQueue = localStorage.getItem(QUEUE_KEY);

    if (!existingQueue) {
      return { cleaned: false }; // No queue to clean
    }

    // Attempt to validate the queue structure
    try {
      const parsed = JSON.parse(existingQueue);
      
      // Optional: Add validation logic here
      // For now, just remove it since offline sync is disabled
      if (Array.isArray(parsed) || typeof parsed === 'object') {
        localStorage.removeItem(QUEUE_KEY);
        console.log(
          '[Offline Cleanup] Removed corrupted queue from localStorage',
          {
            queueSize: existingQueue.length,
            itemCount: Array.isArray(parsed) ? parsed.length : 'unknown',
            timestamp: new Date().toISOString(),
          }
        );
        return { cleaned: true };
      }
    } catch (parseError) {
      // Queue is corrupted JSON, remove it
      localStorage.removeItem(QUEUE_KEY);
      console.log(
        '[Offline Cleanup] Removed corrupted queue (invalid JSON)',
        {
          error: parseError instanceof Error ? parseError.message : String(parseError),
          timestamp: new Date().toISOString(),
        }
      );
      return { cleaned: true };
    }

    return { cleaned: false };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('[Offline Cleanup] Unexpected error during cleanup:', errorMsg);
    return { cleaned: false, error: errorMsg };
  }
}

/**
 * HOW TO USE (optional):
 * 
 * Add to app/layout.tsx or app/page.tsx on first component render:
 * 
 * import { cleanupCorruptedOfflineQueue } from '@/lib/offline-cleanup';
 * 
 * // Inside your component or useEffect:
 * useEffect(() => {
 *   const result = cleanupCorruptedOfflineQueue();
 *   if (result.cleaned) {
 *     console.log('✅ Offline state cleaned successfully');
 *   }
 * }, []);
 * 
 * Or as a standalone call on app startup:
 * 
 * // At the very top level of app initialization
 * if (typeof window !== 'undefined') {
 *   cleanupCorruptedOfflineQueue();
 * }
 */
