import Wizard from '@/components/Wizard';
import { createContext, useContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

interface WizardModalProps {
  setWizard: (value: any) => void;
}

export const WizardContext = createContext({} as WizardModalProps);

export const WizardProvider: React.FC = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  const [wizard, setWizard] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = !!wizard ? 'hidden' : 'visible';
  }, [wizard]);

  const wizProps = {
    isOpen: wizard,
    contract: 0,
    closeModal: setWizard,
  };

  const values: WizardModalProps = {
    setWizard,
  };

  return (
    <WizardContext.Provider value={values}>
      {children}

      {mounted &&
        wizard &&
        ReactDOM.createPortal(<Wizard {...wizProps} />, window.document.body)}
    </WizardContext.Provider>
  );
};

export const useWizard = (): WizardModalProps => useContext(WizardContext);
