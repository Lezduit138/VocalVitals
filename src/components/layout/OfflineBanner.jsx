import { useEffect, useState } from 'react';
import { useStore } from '../../store';
import { WifiOff } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function OfflineBanner() {
  const isOffline = useStore((state) => state.isOffline);
  const setOfflineStatus = useStore((state) => state.setOfflineStatus);

  useEffect(() => {
    const handleOnline = () => setOfflineStatus(false);
    const handleOffline = () => setOfflineStatus(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOfflineStatus]);

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-50 bg-surface-elevated border-b border-warning/20 px-4 py-2 flex items-center justify-center space-x-2 shadow-lg backdrop-blur-md"
        >
          <div className="w-2 h-2 rounded-full bg-warning animate-pulse"></div>
          <WifiOff className="w-4 h-4 text-warning" />
          <span className="text-sm font-medium text-warning">
            Offline Mode — Using cached data
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
