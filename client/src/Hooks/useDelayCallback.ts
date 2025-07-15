import { useCallback, useRef } from "react";

// delay callback
export default function useDelayCallback(fn: (...args: any) => void, delay: number) {
  const timer = useRef<number>(0);

  return useCallback((...args: any) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => fn(...args), delay);
  }, [fn, delay]);
}