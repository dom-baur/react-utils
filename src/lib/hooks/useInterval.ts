import { useRef, useCallback, useState, useEffect } from "react";

/**
 * The interface for the polling properties
 */
interface UseIntervalProps {
  /**
   * The callback function
   */
  callback: () => void;
  /**
   * The interval of the polling function
   */
  interval: number;
  /**
   * The boolean to set if the hook is initially polling or not
   */
  autoStart: boolean;
}

/**
 * The interface for the polling result
 */
interface UseIntervalResult {
  /**
   * The current state of the hook whether it's polling or not
   */
  isRunning: boolean;
  /**
   * The function to start polling
   */
  startInterval: () => void;
  /**
   * The function to stop polling
   */
  stopInterval(): void;
}

/**
 * The useInterval hook
 * @param props The props for the useInterval hook, see {@link UseIntervalProps}
 * @returns The result of the useInterval, see {@link UseIntervalResult}
 */
const useInterval = (props: UseIntervalProps): UseIntervalResult => {
  const { autoStart, callback, interval } = props;
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const callbackRef = useRef<() => void>(callback);

  const startInterval = useCallback(() => {
    setIsRunning((prevIsRunning) => {
      if (!prevIsRunning && (!intervalRef.current || intervalRef.current === -1)) {
        intervalRef.current = window.setInterval(callbackRef.current, interval);
      }
      return true;
    });
  }, [interval]);

  const stopInterval = useCallback(() => {
    setIsRunning(false);
    window.clearInterval(intervalRef.current || -1);
    intervalRef.current = -1;
  }, []);

  useEffect(() => {
    callbackRef.current = callback;
    console.log("Starting interval", isRunning);
    if (isRunning) {
      startInterval();
    }
    return stopInterval;
  }, [callback, isRunning, interval, startInterval, stopInterval]);

  useEffect(() => {
    if (autoStart) {
      startInterval();
    }
  }, [autoStart, startInterval]);

  return { isRunning, startInterval, stopInterval };
};

export { useInterval };
