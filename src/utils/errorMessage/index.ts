import { capitalizeString } from '../convertString';

/**
 * Renders an api layer error as a readable sentence.
 *
 * The api layer puts a string in `error` when the backend answered with an
 * error body, but the caught `Error` object when the request never completed.
 * Formatting the value as a string directly therefore threw on exactly the
 * failures it was meant to report, so the message never reached the user.
 */
export const capitalizeError = (error: unknown): string =>
  capitalizeString(error instanceof Error ? error.message : String(error));
