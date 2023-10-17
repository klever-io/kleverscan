import ReactGA from 'react-ga';

export const initGA = (trackingId: string): void => {
  ReactGA.initialize(trackingId);
};

export const logPageView = (): void => {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
};
