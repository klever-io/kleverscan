import { NextRouter } from 'next/router';
import { setQueryAndRouter } from '..';

export const setQuery = async (
  key: string,
  value: string,
  router: NextRouter,
): Promise<void> => {
  while (!router.isReady) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  const newQuery = {
    ...router.query,
  };

  if (value) {
    if (!newQuery?.contractDetails) newQuery.contractDetails = '{}';

    newQuery.contractDetails = JSON.stringify({
      ...JSON.parse(newQuery.contractDetails as string),
      [key]: value,
    });
  } else {
    if (!newQuery?.contractDetails) return;

    const contractDetails = JSON.parse(newQuery.contractDetails as string);
    if (!contractDetails[key]) return;

    delete contractDetails[key];
    newQuery.contractDetails = JSON.stringify(contractDetails);
  }
  setQueryAndRouter(newQuery, router);
};
