//create context

import { createContext, useContext, useState } from 'react';

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
