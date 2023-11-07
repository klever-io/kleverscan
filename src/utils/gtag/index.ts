export const gtagEvent = (
  eventName: string | Gtag.EventNames,
  eventParams?:
    | Gtag.CustomParams
    | Gtag.ControlParams
    | Gtag.EventParams
    | undefined,
): void => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, eventParams);
  }
};
