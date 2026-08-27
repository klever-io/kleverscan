import { TFunction } from 'next-i18next';

/** 1e12 ms is 2001 and 1e12 seconds is the year 33658, so no chain timestamp
 *  lands near this in either unit. */
const MILLISECOND_FLOOR = 1e12;

/** A chain timestamp in milliseconds, whichever unit it arrived in: `address/
 *  list` mixes both in one field, 1656680400 next to 1656680400000 for the
 *  same instant. `getAge` below fixes the same thing for display. */
export const toMilliseconds = (timestamp: number): number =>
  timestamp < MILLISECOND_FLOOR ? timestamp * 1000 : timestamp;

/**
 * Receives a Date instance and calculate how many time has passed between now and this Date. Will return a string indicating how many time passed. Second arg is for translation option (optional).
 * @param date
 * @param t
 * @returns string
 */
/**
 * A chain timestamp scaled until the year looks sane, in milliseconds.
 *
 * Both formatters below need this because timestamps arrive in seconds or in
 * milliseconds depending on the endpoint. Two inputs break the scaling on
 * their own and are handled here rather than in each caller: 0 multiplies to 0
 * forever, which hangs the render, and anything past the Date range makes
 * every getter answer NaN, which both loops fall straight through because NaN
 * compares false either way, printing "NaN/NaN/aN".
 */
export const normalizeTimestamp = (timestamp: number): number => {
  if (!Number.isFinite(timestamp) || timestamp <= 0) return 0;
  if (Number.isNaN(new Date(timestamp).getTime())) return 0;

  let value = timestamp;
  while (new Date(value).getFullYear() < 2000) {
    value = value * 10 ** 3;
  }
  while (new Date(value).getFullYear() > 3000) {
    value = value / 10 ** 3;
  }
  return value;
};

export const getAge = (dateInput: Date, t?: TFunction): string => {
  // The formatters' normalisation: the unguarded copy that sat here hung the
  // render on a zero and fell through to NaN on an out-of-range date.
  const date = new Date(normalizeTimestamp(dateInput?.getTime?.() ?? NaN));

  const diff = Math.abs(new Date().getTime() - date.getTime());
  const sec = Math.floor(diff / 1000);
  const min = Math.floor(diff / (1000 * 60));
  const hour = Math.floor(diff / (1000 * 60 * 60));
  const day = Math.floor(diff / (1000 * 60 * 60 * 24));

  let val = 0;
  let suffix = '';

  if (sec <= 59) {
    val = sec;
    suffix = t ? t('Date.Time.sec') : 'sec';
  } else if (sec > 59 && min <= 59) {
    val = min;
    suffix = t ? t('Date.Time.min') : 'min';
  } else if (min > 59 && hour <= 23) {
    val = hour;
    suffix = t ? t('Date.Time.hour') : 'hour';
  } else if (hour >= 24) {
    val = day;
    suffix = t ? t('Date.Time.day') : 'day';
  }
  return `${val} ${suffix}${val > 1 ? 's' : ''}`;
};

/**
 * Receive a number as first arg that represents seconds, process this number to returns it's representation in hours, minutes and seconds as a string. Second argument is if translation option was passed.
 * @param input
 * @param t
 * @returns string
 */
export const secondsToHourMinSec = (input: number, t?: TFunction): string => {
  let result = '';

  const isNegative = input < 0;

  if (isNegative) {
    result = '- ';
    input = input * -1;
  }

  const numSecondsInAMinute = 60;
  const numMinutesInAHour = 60;
  const numSecondsInAHour = numSecondsInAMinute * numMinutesInAHour;

  const hours = Math.floor(input / numSecondsInAHour);
  let remainingSeconds = input % numSecondsInAHour;
  const minutes = Math.floor(remainingSeconds / numSecondsInAMinute);
  remainingSeconds = Math.floor(remainingSeconds % numSecondsInAMinute);

  if (hours > 0) {
    result += `${hours}h`;
  }
  if (minutes > 0) {
    result += ` ${minutes}m`;
  }
  if (remainingSeconds > 0) {
    result += ` ${remainingSeconds}s`;
  }

  if (!result) {
    return '0s';
  }
  return result;
};

export const secondsToMonthDayHourMinSec = (input: number): string => {
  let result = '';

  const isNegative = input < 0;

  if (isNegative) {
    result = '- ';
    input = input * -1;
  }

  const numSecondsInAMinute = 60;
  const numMinutesInAHour = 60;
  const numSecondsInAHour = numSecondsInAMinute * numMinutesInAHour;
  const numHoursInADay = 24;
  const numDaysInAMonth = 30;
  const numSecondsInADay = numSecondsInAHour * numHoursInADay;
  const numSecondsInAMonth = numSecondsInADay * numDaysInAMonth;

  const months = Math.floor(input / numSecondsInAMonth);
  let remainingSeconds = input % numSecondsInAMonth;
  const days = Math.floor(remainingSeconds / numSecondsInADay);
  remainingSeconds = remainingSeconds % numSecondsInADay;
  const hours = Math.floor(remainingSeconds / numSecondsInAHour);
  remainingSeconds = remainingSeconds % numSecondsInAHour;
  const minutes = Math.floor(remainingSeconds / numSecondsInAMinute);
  remainingSeconds = Math.floor(remainingSeconds % numSecondsInAMinute);

  if (months > 0) {
    result += `${months}m`;
  }
  if (days > 0) {
    result += ` ${days}d`;
  }
  if (hours > 0) {
    result += ` ${hours}h`;
  }
  if (minutes > 0) {
    result += ` ${minutes}m`;
  }
  if (remainingSeconds > 0) {
    result += ` ${remainingSeconds}s`;
  }

  result += ' ';
  return result;
};

/**
 * Converts a timestamp number into a Date instance and returns it's time based on user locale.
 * @param timestamp
 * @returns string
 */
export const timestampToDate = (timestamp: number): string => {
  const time = new Date(timestamp * 1000);
  return time.toLocaleString();
};
