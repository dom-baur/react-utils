import { useState, useRef, useCallback, useEffect } from "react";

/**
 * The interface for the polling properties
 */
interface UsePollingProps {
  /**
   * The callback function
   */
  callback: () => void | Promise<void>;
  /**
   * The interval of the polling function
   */
  interval: number;
  /**
   * The boolean to set if the hook is stopped or not
   */
  stopped: boolean;
}

/**
 * The interface for the polling result
 */
interface UsePollingResult {
  /**
   * The current state of the hook wheter it's polling or not
   */
  isPolling: boolean;
  /**
   * The function to start polling
   */
  startPolling(): void;
  /**
   * The function to stopp polling
   */
  stopPolling(): void;
}

/**
 * The polling hook
 * @param props The parameters to set the function for the polling, the interval and if the hook is stopped or not
 * @returns The functions startPolling, stoppPolling and a boolean wheter the hook is currently polling or not
 */
const usePolling = (props: UsePollingProps): UsePollingResult => {
  const { callback, interval, stopped } = props;

  const [isPolling, setIsPolling] = useState(false);

  const persistedIsPolling = useRef<boolean>();
  const timeout = useRef<NodeJS.Timeout>();

  persistedIsPolling.current = isPolling;

  const stopPolling = useCallback(() => {
    clearTimeout(timeout.current);
    setIsPolling(false);
  }, []);

  const runPolling = useCallback(() => {
    timeout.current = setTimeout(() => {
      void (async () => {
        try {
          await callback();
        } finally {
          persistedIsPolling.current ? runPolling() : stopPolling();
        }
      })();
    }, interval);
  }, [callback, interval, stopPolling]);

  const startPolling = useCallback(() => {
    setIsPolling(true);
    runPolling();
  }, [runPolling]);

  useEffect(() => {
    if (!stopped) {
      startPolling();
    }

    return () => {
      stopPolling();
    };
  }, [interval, stopped, startPolling, stopPolling]);

  return {
    isPolling,
    startPolling,
    stopPolling,
  };
};

export { usePolling };
