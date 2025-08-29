import { useRef, useCallback, useState, useEffect } from "react";

/**
 * The interface for the properties of the useInterval hook
 */
interface UseIntervalProps {
  /**
   * The callback function
   */
  callback: () => void;
  /**
   * The interval in miliseconds for the interval function
   */
  interval: number;
  /**
   * The boolean to set if the interval should start automatically or not
   * @default false
   */
  autoStart?: boolean;
}

/**
 * The interface for the result of the useInterval hook
 */
interface UseIntervalResult {
  /**
   * The current state whether the interval is running or not
   */
  isRunning: boolean;
  /**
   * The function to start the interval
   */
  startInterval: () => void;
  /**
   * The function to stop the interval
   */
  stopInterval: () => void;
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
