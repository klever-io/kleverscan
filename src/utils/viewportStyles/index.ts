import { ICustomStyles } from '@/types';

/**
 * Pass custom styles object to the tooltip for mobile and tablet cases.
 * @param mobileStyles mobile object offset styles for tooltip
 * @param tabletStyles tablet object offset styles for tooltip
 * @param isMobile boolean to know if viewport is mobile
 * @param isTablet boolean to know if viewport is tablet
 */
export const passViewportStyles = (
  isMobile: boolean,
  isTablet: boolean,
  mobileStyles: ICustomStyles = {},
  tabletStyles: ICustomStyles = {},
  desktopStyles: ICustomStyles = {},
): ICustomStyles => {
  if (isMobile) {
    return mobileStyles;
  }
  if (isTablet) {
    return tabletStyles;
  }
  return desktopStyles;
};

export const typeVoteColors = {
  Yes: '#B039BF',
  No: '#FF4A4A',
};
