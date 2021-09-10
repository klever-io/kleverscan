export const breakText = (text: string, limit: number): string => {
  return text.length > limit ? `${text.substring(0, limit)}...` : text;
};
