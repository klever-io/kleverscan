import api from '@/services/api';
import { IAccountResponse } from '@/types';

const getAccount = async (hash: string): Promise<IAccountResponse> =>
  api.get({
    route: `address/${hash}`,
  });

export default getAccount;
