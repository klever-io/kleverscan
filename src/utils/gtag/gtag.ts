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

export const hasExtensionWalletAccess = (hasAccess: boolean) => {
  window.gtag('event', 'has_extension_wallet_access', {
    has_access: hasAccess,
  });
};

export const searchEvent = (type: string) => {
  window.gtag('event', 'search_type_event', {
    search_type: type,
  });
};
