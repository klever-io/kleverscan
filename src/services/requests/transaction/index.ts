import api from '@/services/api';
import { ITransactionResponse } from '@/types';

const getTransaction = async (hash: string): Promise<ITransactionResponse> =>
  api.get({
    route: `transaction/${hash}`,
  });

export default getTransaction;
