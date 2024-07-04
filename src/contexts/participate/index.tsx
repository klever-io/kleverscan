import { PropsWithChildren } from 'react';
import { LoadingBackground } from '@/components/Contract/styles';
import { Loader } from '@/components/Loader/styles';
import { createContext, useContext, useState } from 'react';
import ReactDOM from 'react-dom';

interface IParticipate {
  openParticipateModal: boolean;
  setOpenParticipateModal: React.Dispatch<React.SetStateAction<boolean>>;
  openApplyFormModal: boolean;
  setOpenApplyFormModal: React.Dispatch<React.SetStateAction<boolean>>;
  txHash: string | null;
  setTxHash: React.Dispatch<React.SetStateAction<string | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Participate = createContext({} as IParticipate);

export const ParticipateProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [openParticipateModal, setOpenParticipateModal] = useState(false);
  const [openApplyFormModal, setOpenApplyFormModal] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const values: IParticipate = {
    openParticipateModal,
    setOpenParticipateModal,
    openApplyFormModal,
    setOpenApplyFormModal,
    txHash,
    setTxHash,
    loading,
    setLoading,
  };

  return (
    <Participate.Provider value={values}>
      {children}
      {loading
        ? ReactDOM.createPortal(
            <LoadingBackground>
              <Loader />
            </LoadingBackground>,
            window.document.body,
          )
        : null}
    </Participate.Provider>
  );
};

export const useParticipate = (): IParticipate => useContext(Participate);
