export const GA_TRACKING_ID = '<YOUR_GA_TRACKING_ID>';

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string): void => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

type GTagEvent = {
  action: string;
  category: string;
  label: string;
  value: number;
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: GTagEvent): void => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

export const cryptoWalletDetected = (extensions: string[], total: number) => {
  window.gtag('event', 'crypto_wallet_detected', {
    extensions: extensions.join(','),
    total_detected: total,
  });
};
