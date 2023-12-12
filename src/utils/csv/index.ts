import { ITransaction } from '@/types';
import { TFunction } from 'next-i18next';
import { NextRouter } from 'next/router';
import {
  getContractCells,
  getDefaultCells,
  getHeaderForCSV,
  initialsTableHeaders,
} from '../contracts';

const processHeaders = (router: NextRouter, t: TFunction) => {
  const deafultHeaders = [...initialsTableHeaders(t)];
  deafultHeaders.push(t('Blocks.kApp Fees'), t('Transactions.Bandwidth Fee'));
  const headers = getHeaderForCSV(router, deafultHeaders, t);
  const sanitizedHeaders = headers.filter(header => header !== '');
  return sanitizedHeaders;
};

const sanitizeRow = (parsedRow: any[]) => {
  let finalVal = '';
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

const processDefaultRow = async (
  row: ITransaction,
  isMulticontract = false,
): Promise<string> => {
  const parsedRow = await getDefaultCells(row, isMulticontract);
  return sanitizeRow(parsedRow);
};

export const processContractRow = async (
  row: ITransaction,
  isMulticontract = false,
  index = 0,
): Promise<string> => {
  const parsedRow = await getContractCells(row, isMulticontract, index);
  return sanitizeRow(parsedRow);
};

const generateCSVFile = (csvFile: string, filename: string) => {
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

export const exportToCsv = async (
  filename: string,
  rows: ITransaction[] | null,
  router: NextRouter,
  t: TFunction,
): Promise<void> => {
  if (!rows || rows.length === 0) {
    window.alert('No data to export!');
    return;
  }
  let csvFile = '';
  for (let i = -1; i < rows.length; i++) {
    const rowContract = rows[i]?.contract || [];
    const isDefaultHeaders = !router?.query?.type;
    const isMulticontract = rows[i]?.contract.length > 1;

    if (i === -1) {
      const headers = processHeaders(router, t);
      csvFile += headers + '\n';
      continue;
    }

    if (isDefaultHeaders) {
      if (isMulticontract) {
        for (let j = 0; j < rowContract.length; j++) {
          const rowWithFilteredContract = {
            ...rows[i],
            contract: [rows[i]?.contract[j]],
          };
          csvFile += await processDefaultRow(rowWithFilteredContract, true);
        }
      } else {
        csvFile += await processDefaultRow(rows[i]);
      }
      continue;
    }

    if (!isDefaultHeaders) {
      if (isMulticontract) {
        for (let j = 0; j < rowContract.length; j++) {
          if (rows[i]?.contract[j].type === Number(router.query.type)) {
            const rowWithFilteredContract = {
              ...rows[i],
              contract: [rows[i]?.contract[j]],
            };
            csvFile += await processContractRow(
              rowWithFilteredContract,
              true,
              j,
            );
          }
        }
      } else {
        csvFile += await processContractRow(rows[i]);
      }
    }
  }
  generateCSVFile(csvFile, filename);
};
