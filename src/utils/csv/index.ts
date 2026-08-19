import { ITransaction } from '@/types';
import { NextRouter } from 'next/router';
import { toast } from 'react-toastify';
import {
  getContractCells,
  getDefaultCells,
  getHeaderForCSV,
  initialsTableHeaders,
} from '../contracts';

const processHeaders = (router: NextRouter) => {
  const deafultHeaders = [...initialsTableHeaders];
  if (!router.query.type) {
    deafultHeaders.push('Amount', 'AssetId');
  }
  deafultHeaders.push('kApp Fee', 'Bandwidth Fee');
  const headers = getHeaderForCSV(router, deafultHeaders);
  const sanitizedHeaders = headers.filter(header => header !== '');
  return sanitizedHeaders;
};

const FORMULA_PREFIXES = new Set(['=', '+', '-', '@', '\t']);

/**
 * Cells starting with one of these are evaluated as a formula by Excel and
 * LibreOffice, and quoting does not help because they strip the quotes on
 * import. Chain supplied text (asset ticker, account name, proposal
 * description) reaches these cells, so a leading quote is added to keep the
 * value inert. Values that parse as a number are left alone, so a negative
 * amount stays a number rather than becoming text.
 *
 * Carriage return is absent on purpose: the caller collapses line breaks
 * before calling this, so one can never be the first character here. Move
 * that collapse and a leading CR becomes reachable again.
 */
const escapeFormula = (value: string): string =>
  FORMULA_PREFIXES.has(value.charAt(0)) && Number.isNaN(Number(value))
    ? `'${value}`
    : value;

export const sanitizeRow = (parsedRow: any[]): string => {
  let finalVal = '';
  for (let j = 0; j < parsedRow.length; j++) {
    const innerValue =
      parsedRow[j] === null || parsedRow[j] === undefined
        ? ''
        : parsedRow[j].toString();

    // Collapse line breaks first. A bare CR is a record separator to a CSV
    // reader but is not covered by the quoting test below, so a value carrying
    // one would split the row and drop its tail into the next record's first
    // cell, past the formula check.
    const singleLine = innerValue.replace(/[\r\n]+/g, ' ');

    // Quote on any character a reader may treat as a field separator, not just
    // the comma: Excel and LibreOffice follow the locale list separator, which
    // is a semicolon across most of continental Europe. Without this, a cell
    // holding one splits there and its tail starts a new field, which the
    // formula check never saw.
    let result = escapeFormula(singleLine).replace(/"/g, '""');
    if (result.search(/["\n,;\t]/g) >= 0) result = '"' + result + '"';
    if (j > 0) finalVal += ',';
    finalVal += result;
  }
  return finalVal + '\n';
};

const processDefaultRow = async (
  row: ITransaction,
  isMulticontract = false,
  index = 0,
): Promise<string> => {
  const parsedRow = await getDefaultCells(row, isMulticontract, index);
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
): Promise<void> => {
  if (!rows || rows.length === 0) {
    toast.error('No data to export!');
    return;
  }

  try {
    let csvFile = '';
    for (let i = -1; i < rows.length; i++) {
      const rowContract = rows[i]?.contract || [];
      const isDefaultHeaders = !router?.query?.type;
      const isMulticontract = rows[i]?.contract.length > 1;

      if (i === -1) {
        const headers = processHeaders(router);
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
            csvFile += await processDefaultRow(
              rowWithFilteredContract,
              true,
              j,
            );
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
  } catch (error) {
    console.error(error);
    toast.error(
      'Error exporting CSV, try exporting successful transactions only',
    );
  }
};
