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
const paramsMobile = { place: 'left' as Place };
const paramsTablet = { place: 'left' as Place };
export const paramsStyles = [paramsMobile, paramsTablet];

//proposal page tip
export const tipMobile = { place: 'right' as Place };
