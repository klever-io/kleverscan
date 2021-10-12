export const breakText = (text: string, limit: number): string => {
  return text.length > limit ? `${text.substring(0, limit)}...` : text;
};

export const getAge = (date: Date): string => {
  const diff = Math.abs(new Date().getTime() - date.getTime());

  const sec = Math.ceil(diff / 1000);
  const min = Math.ceil(diff / (1000 * 60));
  const hour = Math.ceil(diff / (1000 * 60 * 60));
  const day = Math.ceil(diff / (1000 * 60 * 60 * 24));

  let val = 0;
  let suffix = '';

  if (sec <= 59) {
    val = sec;
    suffix = 'sec';
  } else if (sec > 59 && min <= 59) {
    val = min;
    suffix = 'min';
  } else if (min > 59 && hour <= 23) {
    val = hour;
    suffix = 'hour';
  } else if (hour > 24) {
    val = day;
    suffix = 'day';
  }

  return `${val} ${suffix}${val > 1 ? 's' : ''}`;
};
