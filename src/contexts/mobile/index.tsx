import { PropsWithChildren } from 'react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';

interface IMobile {
  isDeviceMobileCheck: () => boolean;
  isMobile: boolean;
  isTablet: boolean;
  isCompactHeader: boolean;
  mobileMenuOpen: boolean;
  handleMenu: () => void;
  closeMenu: () => void;
  mobileNavbarRef: React.MutableRefObject<HTMLDivElement | null>;
}

export const Mobile = createContext({} as IMobile);

export const MobileProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isCompactHeader, setIsCompactHeader] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileNavbarRef = useRef<HTMLDivElement>(null);

  const isDeviceMobileCheck = () =>
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator?.userAgent,
    );

  const isMobileCheck = (width: number) =>
    width <= 768 ? setIsMobile(true) : setIsMobile(false);
  // Matches the CSS: `min-width: 1025px` already applies at exactly 1025,
  // so treating that width as tablet here left a gap where neither the
  // desktop nor the mobile controls rendered.
  const isTabletCheck = (width: number) =>
    width < 1025 ? setIsTablet(true) : setIsTablet(false);
  // Where the header bar runs out of room for the wallet pill, measured: at
  // 585px it still renders at its natural 154px, at 580 the row starts
  // squeezing it and its icon shrinks with it, and by 480 the icon is gone.
  // 600 keeps a margin. It used to leave the bar at 768, with 132px of the
  // row still empty.
  const isCompactHeaderCheck = (width: number) =>
    width < 600 ? setIsCompactHeader(true) : setIsCompactHeader(false);

  const handleResize = () => {
    const width = window.innerWidth;
    isMobileCheck(width);
    isTabletCheck(width);
    isCompactHeaderCheck(width);
  };

  useEffect(() => {
    const width = window.innerWidth;
    isMobileCheck(width);
    isTabletCheck(width);
    isCompactHeaderCheck(width);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  useEffect(() => {
    if (!isTablet) {
      setMobileMenuOpen(false);
    }
  }, [isTablet]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'visible';
  }, [mobileMenuOpen]);

  const handleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (mobileNavbarRef.current !== null) {
      mobileNavbarRef.current.style.top = '0';
    }
  };

  const closeMenu = () => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  const values: IMobile = {
    isDeviceMobileCheck,
    isMobile,
    isTablet,
    isCompactHeader,
    mobileMenuOpen,
    handleMenu,
    closeMenu,
    mobileNavbarRef,
  };

  return <Mobile.Provider value={values}>{children}</Mobile.Provider>;
};

export const useMobile = (): IMobile => useContext(Mobile);
