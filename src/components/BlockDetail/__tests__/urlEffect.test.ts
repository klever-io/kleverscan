import { useEffect, useLayoutEffect } from 'react';
import { pickUrlEffect } from '@/components/BlockDetail/urlEffect';

describe('pickUrlEffect', () => {
  it('reads the URL after paint when there is no window', () => {
    expect(pickUrlEffect(undefined)).toBe(useEffect);
  });

  it('reads the URL before paint in the browser', () => {
    expect(pickUrlEffect(globalThis.window)).toBe(useLayoutEffect);
  });
});
