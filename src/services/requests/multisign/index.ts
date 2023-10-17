import { IMultisignData } from '@/components/MultsignComponent/MultSign';
import api from '@/services/api';
import { Service } from '@/types';
import { ITransaction as ITransactionDecoded } from '@/types/index';
import { ITransaction } from '@klever/sdk-web';
import { toast } from 'react-toastify';

export const requestMultisign = async (walletAddress: string): Promise<any> => {
  try {
    if (!!!walletAddress) {
      toast.warning('No wallet connected!');
      return [];
    }

    const response = await api.get({
      route: `transaction/by-address/${walletAddress}`,
      service: Service.MULTISIGN,
    });
    if (response.error) {
      toast.error('Something went wrong, please try again');
      return [];
    }

    return response as IMultisignData;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const requestDecoded = async (
  payload: Omit<ITransaction, 'Signature'>,
): Promise<ITransactionDecoded | Record<string, never>> => {
  try {
    const apiRes = await api.post({
      route: 'transaction/decode',
      body: payload,
      service: Service.NODE,
    });

    if (apiRes.error) {
      toast.error('Something went wrong, please try again');

      return {};
    }
    return apiRes.data.tx;
  } catch (error) {
    toast.error('Something went wrong, please try again');
    return {};
  }
};
