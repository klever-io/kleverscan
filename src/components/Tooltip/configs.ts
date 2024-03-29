import { Place } from '@/types/index';

//transactions page coin
const coinMobile = {
  offset: { left: 40, top: 2 },
  place: 'top' as Place,
};
const coinTablet = {
  offset: { left: 100, top: 2 },
  place: 'top' as Place,
};
export const coinStyles = [coinMobile, coinTablet];

//proposals page network params
const paramsMobile = { offset: { right: 170 }, place: 'left' as Place };
const paramsTablet = { offset: { right: 200 }, place: 'left' as Place };
const paramsDesktop = { offset: { left: 50 } };
export const paramsStyles = [paramsMobile, paramsTablet, paramsDesktop];

//proposal page tip
export const tipMobile = { offset: {}, place: 'right' as Place };
