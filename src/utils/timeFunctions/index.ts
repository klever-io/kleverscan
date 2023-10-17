import { TFunction } from 'next-i18next';

/**
 * Receives a Date instance and calculate how many time has passed between now and this Date. Will return a string indicating how many time passed. Second arg is for translation option (optional).
 * @param date
 * @param t
 * @returns string
 */
export const getAge = (dateInput: Date, t?: TFunction): string => {
  let date = dateInput;
  while (new Date(date).getFullYear() < 2000) {
    date = new Date(date.getTime() * 10 ** 3);
  }

  while (new Date(date).getFullYear() > 3000) {
    date = new Date(date.getTime() / 10 ** 3);
  }

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
  } else if (hour > 24) {
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
  const numSecondsInAMinute = 60;
  const numMinutesInAHour = 60;
  const numSecondsInAHour = numSecondsInAMinute * numMinutesInAHour;
  let result = '';

  const hours = Math.floor(input / numSecondsInAMinute / numMinutesInAHour);
  let seconds = input % numSecondsInAHour;
  const minutes = Math.floor(seconds / numSecondsInAMinute);
  seconds = input % numSecondsInAMinute;

  if (hours > 0) {
    result = `${hours}h`;
  }
  if (minutes > 0) {
    result += ` ${minutes}m`;
  }
  if (seconds > 0) {
    result += ` ${seconds}s`;
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
