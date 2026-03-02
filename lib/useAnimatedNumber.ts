'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Animates a number from 0 to the target value on mount/change.
 * Uses requestAnimationFrame for smooth 60fps animation.
 */
export function useAnimatedNumber(target: number, duration = 800): number {
  const [current, setCurrent] = useState(0);
  const prevTarget = useRef(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const start = prevTarget.current;
    const diff = target - start;
    if (diff === 0) return;

    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic for a polished deceleration
      const eased = 1 - Math.pow(1 - progress, 3);

      setCurrent(start + diff * eased);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        prevTarget.current = target;
      }
    }

    frameRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration]);

  return current;
}
