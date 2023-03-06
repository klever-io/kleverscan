import { NextParsedUrlQuery } from 'next/dist/server/request-meta';

/**
 * Receive query as object with filters and "RESET" the date filter
 * @param query is required to reset the date filter
 * @returns return object with all filters and the new date
 */
export const resetDate = (query: NextParsedUrlQuery): NextParsedUrlQuery => {
  const updatedQuery = { ...query };
  delete updatedQuery.startdate;
  delete updatedQuery.enddate;
  return updatedQuery;
};
