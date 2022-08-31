import { createContext, useContext, useEffect, useState } from 'react';

interface IWidth {
  width: number;
  isMobile: boolean;
}

export const Width = createContext({} as IWidth);

export const WidthProvider: React.FC = ({ children }) => {
  const [width, setWidth] = useState(0);

  const isMobile = width <= 768;

  const handleResize = () => setWidth(window.innerWidth);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    setWidth(window.innerWidth);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  const values: IWidth = {
    width,
    isMobile: isMobile,
  };

  return <Width.Provider value={values}>{children}</Width.Provider>;
};

export const useWidth = (): IWidth => useContext(Width);
