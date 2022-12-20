/* eslint-disable @typescript-eslint/ban-types */
import { useEffect, useRef } from 'react';

export const useDidUpdateEffect = (fn: Function, inputs: Array<any>): void => {
  const didMountRef = useRef(false);

  useEffect(() => {
    if (didMountRef.current) {
      return fn();
    }
    didMountRef.current = true;
  }, inputs);
};

export const useScroll = (
  condition: boolean,
  callback: (this: Window, ev: Event) => any,
): void => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (condition) {
        window.addEventListener('scroll', callback);
      } else {
        window.removeEventListener('scroll', callback);
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', callback);
      }
    };
  }, [condition]);
};
