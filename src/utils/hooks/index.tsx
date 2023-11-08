/* eslint-disable @typescript-eslint/ban-types */
import Skeleton from '@/components/Skeleton';
import api from '@/services/api';
import { IAssetsResponse, IValidatorResponse } from '@/types';
import { IPackInfo } from '@/types/contracts';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { getPrecision } from '../precisionFunctions';

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

export function usePrecision<T extends string | string[]>(
  assetIds: T,
): T extends string ? number : { [assetId: string]: number };
export function usePrecision(
  assetIds: string | string[],
): number | { [assetId: string]: number } {
  const [precision, setPrecision] = useState<
    number | { [assetId: string]: number }
  >(0);
  useEffect(() => {
    const precisionCall = async () => {
      setPrecision(await getPrecision(assetIds));
    };
    precisionCall();
  }, []);
  if (typeof precision === 'number') {
    return precision as number;
  } else {
    return precision as { [assetId: string]: number };
  }
}

type PartialResponse = IAssetsResponse | IValidatorResponse;

export const useFetchPartial = <T,>(
  type: string,
  route: string,
  dataType: string,
): [
  T[],
  (value: string) => Promise<T[]>,
  boolean,
  Dispatch<SetStateAction<boolean>>,
] => {
  const localStorageName = `all${type}Search`;
  const [items, setItems] = useState<T[]>([]);
  const [itemsSearch, setItemsSearch] = useState<T[]>(() => {
    try {
      const storedData = localStorage.getItem(localStorageName);
      return storedData ? JSON.parse(storedData) : [];
    } catch (error) {
      console.error('Error parsing stored data:', error);
      return [];
    }
  });
  const [loading, setLoading] = useState<boolean>(false);
  let fetchPartialTimeout: ReturnType<typeof setTimeout>;

  const initialState = async () => {
    if (type !== 'validators') {
      const response = await api.get({
        route: `${route}`,
        query: { limit: 10 },
      });
      setItems([...(response?.data?.[type] || []), ...itemsSearch]);
    } else {
      setItems([...itemsSearch]);
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem(localStorageName, JSON.stringify(itemsSearch));
    } catch (error) {
      console.error('Error storing data:', error);
    }
  }, [itemsSearch]);
  const addAssetsLocalStorage = (response: T[]) => {
    setItemsSearch([...itemsSearch, ...response]);
  };
  useEffect(() => {
    initialState();
  }, []);
  return [
    items,
    value => {
      clearTimeout(fetchPartialTimeout);
      return new Promise(res => {
        fetchPartialTimeout = setTimeout(async () => {
          let response: PartialResponse;
          if (
            value &&
            !items.find(asset =>
              asset[dataType].toUpperCase().includes(value.toUpperCase()),
            )
          ) {
            if (type !== 'assets') {
              response = await api.get({
                route: `${route}?${dataType}=${value}`,
              });
            } else {
              response = await api.get({
                route: `${route}?asset=${value}`,
              });
            }
            if (!response.data[type].length) {
              setItems([...items]);
            } else {
              res(response.data[type]);
              addAssetsLocalStorage(response.data[type]);
              setItems([...items, ...response.data[type]]);
            }
            res(response.data[type]);
            setLoading(false);
          } else {
            setLoading(false);
            res(items);
          }
        }, 500);
      });
    },
    loading,
    setLoading,
  ];
};

export const useSkeleton = (): [
  (
    value: string | number | undefined | JSX.Element[],
    skeletonParams?: { height?: string | number; width?: number | string },
  ) => Element | number | string | JSX.Element | JSX.Element[],
  Dispatch<SetStateAction<boolean>>,
] => {
  const [loading, setLoading] = useState(true);
  const isSkeleton = (
    value: string | number | undefined | JSX.Element[],
    skeletonParams?: { height?: string | number; width?: number | string },
  ): Element | number | string | JSX.Element | JSX.Element[] => {
    return !loading && value ? value : <Skeleton {...skeletonParams} />;
  };
  return [isSkeleton, setLoading];
};

export type PacksPrecision = {
  [key: string]: number;
};

type PackInfoHookResult = [
  PacksPrecision,
  Dispatch<SetStateAction<PacksPrecision>>,
];

export const usePackInfoPrecisions = (
  packInfo: IPackInfo[],
): PackInfoHookResult => {
  const assetIds: string[] = [];
  const getInitialPrecisions = () => {
    const initialPrecisions: { [key: string]: number } = {};
    for (let index = 0; index < packInfo.length; index++) {
      assetIds.push(packInfo[index].key);
      initialPrecisions[packInfo[index].key] = 0;
    }
    return initialPrecisions;
  };

  const [packsPrecision, setPacksPrecision] = useState<PacksPrecision>(
    getInitialPrecisions(),
  );

  useEffect(() => {
    const getPacksPrecision = async () => {
      const precisions = await getPrecision(assetIds);
      setPacksPrecision(precisions);
    };
    getPacksPrecision();
  }, []);

  return [packsPrecision, setPacksPrecision];
};

export const useForceUpdate = (): (() => void) => {
  const [value, setValue] = useState(0);
  return () => setValue(value => value + 1);
};

export const useDebounce = <T extends unknown>(
  value: T,
  delay: number,
): T | undefined => {
  const [debouncedValue, setDebouncedValue] = useState<T | undefined>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return (): void => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
