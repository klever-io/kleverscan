//create context

import { createContext, useContext, useEffect, useState } from 'react';

interface IModalContext {
  setWarningOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setShowPayloadOpen: React.Dispatch<React.SetStateAction<boolean>>;
  warningOpen: boolean;
  showPayloadOpen: boolean;
}

export const ModalContext = createContext({} as IModalContext);

export const ModalsProvider: React.FC = ({ children }) => {
  const [warningOpen, setWarningOpen] = useState<boolean>(false);
  const [showPayloadOpen, setShowPayloadOpen] = useState(false);

  useEffect(() => {
    if (showPayloadOpen) {
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = 'unset';
    }
  }, [showPayloadOpen]);

  const values: IModalContext = {
    setWarningOpen,
    warningOpen,
    setShowPayloadOpen,
    showPayloadOpen,
  };

  return (
    <ModalContext.Provider value={values}>{children}</ModalContext.Provider>
  );
};

export const useModal = (): IModalContext => useContext(ModalContext);
