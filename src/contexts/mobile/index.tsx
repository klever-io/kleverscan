import { createContext, useContext, useEffect, useRef, useState } from 'react';

interface IMobile {
  isDeviceMobileCheck: () => boolean;
  isMobile: boolean;
  isTablet: boolean;
  mobileMenuOpen: boolean;
  handleMenu: () => void;
  closeMenu: () => void;
  mobileNavbarRef: React.MutableRefObject<HTMLDivElement | null>;
}

export const Mobile = createContext({} as IMobile);

export const MobileProvider: React.FC = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileNavbarRef = useRef<HTMLDivElement>(null);

  const isDeviceMobileCheck = () =>
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator?.userAgent,
    );

  const isMobileCheck = (width: number) =>
    width <= 768 ? setIsMobile(true) : setIsMobile(false);
  const isTabletCheck = (width: number) =>
    width <= 1025 ? setIsTablet(true) : setIsTablet(false);

  const handleResize = () => {
    const width = window.innerWidth;
    isMobileCheck(width);
    isTabletCheck(width);
  };

  useEffect(() => {
    const width = window.innerWidth;
    isMobileCheck(width);
    isTabletCheck(width);
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
    mobileMenuOpen,
    handleMenu,
    closeMenu,
    mobileNavbarRef,
  };

  return <Mobile.Provider value={values}>{children}</Mobile.Provider>;
};

export const useMobile = (): IMobile => useContext(Mobile);
