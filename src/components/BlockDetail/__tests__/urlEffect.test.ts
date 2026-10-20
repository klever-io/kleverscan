import { useEffect, useLayoutEffect } from 'react';
import {
  pickUrlEffect,
  useIsoLayoutEffect,
} from '@/components/BlockDetail/urlEffect';

describe('pickUrlEffect', () => {
  it('reads the URL after paint when there is no window', () => {
    expect(pickUrlEffect(undefined)).toBe(useEffect);
  });

  it('reads the URL before paint in the browser', () => {
    expect(pickUrlEffect(globalThis.window)).toBe(useLayoutEffect);
  });

  it('uses the layout effect while the test has a window', () => {
    expect(useIsoLayoutEffect).toBe(useLayoutEffect);
  });
});
