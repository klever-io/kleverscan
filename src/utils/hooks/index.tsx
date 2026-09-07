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
  // Keyed on the ids themselves, not the array identity: callers build the list
  // inline, so a reference dep would refetch every render. Empty deps used to be
  // harmless only because the app remounted on every navigation.
  const assetKey = Array.isArray(assetIds) ? assetIds.join(',') : assetIds;
  useEffect(() => {
    let active = true;
    // Back to the initial shape first: on a rejected lookup, and during the
    // window before the new one resolves, the previous asset's precision must
    // not scale the new asset's amounts. The array overload resets to a map
    // of zeros, keyed like getPrecision keys its result, because consumers
    // index it and 10 ** undefined renders NaN.
    setPrecision(
      Array.isArray(assetIds)
        ? Object.fromEntries(assetIds.map(id => [id.split('/')[0], 0]))
        : 0,
    );
    const precisionCall = async () => {
      const resolved = await getPrecision(assetIds);
      // A slower earlier request must not overwrite a newer one's answer.
      if (active) setPrecision(resolved);
    };
    // The reset above IS the failure fallback; without this catch every
    // failed lookup is an unhandled rejection.
    precisionCall().catch(() => undefined);
    return () => {
      active = false;
    };
  }, [assetKey]);
  if (typeof precision === 'number') {
    return precision as number;
  } else {
    return precision as { [assetId: string]: number };
  }
}

type PartialResponse =
  | IAssetsResponse
  | IValidatorResponse
  | { [key: string]: any };

export const useFetchPartial = <T,>(
  type: string,
  route: string,
  dataType: string,
  query?: { [key: string]: string | number },
): [
  T[],
  (value: string) => Promise<T[]>,
  boolean,
  Dispatch<SetStateAction<boolean>>,
] => {
  const localStorageName = `all${type}Search`;
  const [items, setItems] = useState<T[]>([]);
  const [itemsSearch, setItemsSearch] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  let fetchPartialTimeout: ReturnType<typeof setTimeout>;

  const initialState = async () => {
    if (type !== 'validators') {
      const response = await api.get({
        route: `${route}`,
        query: {
          limit: 10,
          ...query,
        },
      });
      setItems([...(response?.data?.[type] || []), ...itemsSearch]);
    } else {
      setItems([...itemsSearch]);
    }
  };

  useEffect(() => {
    initialState();
  }, []);
  // Skips rows whose field is not a string: the API can return rows with the
  // field missing, and calling toUpperCase on one used to throw inside the
  // timer below, where nothing rejects. The whole body is wrapped so the
  // promise settles and the spinner resets no matter what fails; before, a
  // throw in here left the caller's `await` hanging and its loading state on
  // forever.
  const matchesValue = (asset: T, value: string): boolean => {
    const field = (asset as { [key: string]: unknown })[dataType];
    return (
      typeof field === 'string' &&
      field.toUpperCase().includes(value.toUpperCase())
    );
  };

  return [
    items,
    value => {
      clearTimeout(fetchPartialTimeout);
      return new Promise(res => {
        fetchPartialTimeout = setTimeout(async () => {
          try {
            let response: PartialResponse;
            if (value && !items.some(asset => matchesValue(asset, value))) {
              setLoading(true);
              if (type !== 'assets') {
                query = { ...query };
                query[dataType] = value;
                response = await api.get({
                  route: `${route}`,
                  query: {
                    dataType: value,
                    ...query,
                  },
                });
              } else {
                response = await api.get({
                  route: `${route}`,
                  query: {
                    asset: value,
                    ...query,
                  },
                });
              }
              // The API's failure mode is HTTP 200 with data: null, so the
              // read has to survive that as well as an empty list.
              const found = response?.data?.[type] ?? [];
              if (found.length) {
                setItems([...items, ...found]);
              }
              res(found.length ? found : items);
            } else {
              res(items);
            }
          } catch (error) {
            console.error(error);
            res(items);
          } finally {
            setLoading(false);
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
    value: string | number | undefined | React.ReactElement[],
    skeletonParams?: { height?: string | number; width?: number | string },
  ) => number | string | React.ReactElement | React.ReactElement[],
  Dispatch<SetStateAction<boolean>>,
] => {
  const [loading, setLoading] = useState(true);
  const isSkeleton = (
    value: string | number | undefined | React.ReactElement[],
    skeletonParams?: { height?: string | number; width?: number | string },
  ): number | string | React.ReactElement | React.ReactElement[] => {
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
  const [packsPrecision, setPacksPrecision] = useState<PacksPrecision>(() =>
    Object.fromEntries(packInfo.map(pack => [pack.key, 0])),
  );

  // Same treatment as usePrecision above: the ids used to be collected inside
  // the useState initializer, so they were frozen at mount and the effect
  // never saw a later packInfo.
  const assetKey = packInfo.map(pack => pack.key).join(',');
  useEffect(() => {
    let active = true;
    const ids = assetKey === '' ? [] : assetKey.split(',');
    // Same reset as usePrecision: a rejected or still-pending lookup must not
    // leave the previous packs' precisions under the new packs.
    setPacksPrecision(Object.fromEntries(ids.map(id => [id, 0])));
    const getPacksPrecision = async () => {
      const precisions = await getPrecision(ids);
      if (active) setPacksPrecision(precisions);
    };
    // Same reason as usePrecision: the zero map above is the fallback.
    getPacksPrecision().catch(() => undefined);
    return () => {
      active = false;
    };
  }, [assetKey]);

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

export const useCountdown = (endTime: number): number => {
  const [remainingTime, setRemainingTime] = useState(endTime - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime(endTime - Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  return remainingTime / 1000;
};
