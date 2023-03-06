import { ITransaction } from '@/types';
import { NextRouter } from 'next/router';
import { getCells, getHeaderForCSV, initialsTableHeaders } from '../contracts';

const processHeaders = (router: NextRouter) => {
  const deafultHeaders = [...initialsTableHeaders];
  deafultHeaders.push('kApp Fee', 'Bandwidth Fee');
  const headers = getHeaderForCSV(router, deafultHeaders);
  const sanitizedHeaders = headers.filter(header => header !== '');
  return sanitizedHeaders;
};

const processRow = async (row: ITransaction, router: NextRouter) => {
  let finalVal = '';
  const parsedRow = await getCells(row, router);
  for (let j = 0; j < parsedRow.length; j++) {
    const innerValue =
      parsedRow[j] === null || parsedRow[j] === undefined
        ? ''
        : parsedRow[j].toString();

    let result = innerValue.replace(/"/g, '""');
    if (result.search(/("|,|\n)/g) >= 0) result = '"' + result + '"';
    if (j > 0) finalVal += ',';
    finalVal += result;
  }
  return finalVal + '\n';
};

export const exportToCsv = async (
  filename: string,
  rows: any[] | null,
  router: NextRouter,
): Promise<void> => {
  if (!rows || rows.length === 0) {
    window.alert('No data to export!');
    return;
  }
  let csvFile = '';
  for (let i = -1; i < rows.length; i++) {
    if (i === -1) {
      const headers = processHeaders(router);
      csvFile += headers + '\n';
    } else {
      csvFile += await processRow(rows[i], router);
    }
  }
  if (typeof window !== undefined) {
    const blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
};

/**
 * Wraps the content and params of a promise and put it inside a loop. The loop will break and return if promise succeeds or it will end after the third try(or the number passed as arg). There is a timeout of 500 milliseconds between each try.
 * @param success callback fn for promise fulfilled
 * @param failure callback fn for promise rejection
 * @param condition the content of the promise
 * @param tries number of tries for the passed promise
 * @returns Promise void
 */
export const asyncDoIf = async (
  success: (result?: any) => any,
  failure: (error?: any) => any,
  condition: () => Promise<any>,
  tries = 3,
): Promise<void> => {
  const array = Array.from({ length: tries }, (_, i) => i);
  let error = '';

  for (const i of array) {
    const result = await condition();
    if (result && !result.error) {
      success(result);
      return;
    } else if (result.error) {
      error = result;
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  failure(error);
  return;
};

/**
 * Makes your promise race with a timeout promise. If it loses, your promise will be rejected. Default timeout is 5 seconds.
 * @param success callback fn for promise fulfilled
 * @param failure callback fn for promise rejection
 * @param condition the content of the promise
 * @param timeoutMS time limit for the timeout promise, indicates how much time your promise has until it fails.
 * @param intervalMS time interval between your promise calls
 * @returns Promise void
 */
export const doIf = async (
  success: () => any,
  failure: () => any,
  condition: () => boolean,
  timeoutMS = 5000,
  intervalMS = 100,
): Promise<void> => {
  let interval: any;

  const IntervalPromise = new Promise(resolve => {
    interval = setInterval(() => {
      if (condition()) {
        resolve(
          (() => {
            success();
            clearInterval(interval);
            clearTimeout(timeout);
          })(),
        );
      }
    }, intervalMS);
  });

  let timeout: any;

  const TimeoutPromise = new Promise(resolve => {
    timeout = setTimeout(() => {
      resolve(
        (() => {
          failure();
          clearInterval(interval);
        })(),
      );
    }, timeoutMS);
  });

  await Promise.race([IntervalPromise, TimeoutPromise]);
};
