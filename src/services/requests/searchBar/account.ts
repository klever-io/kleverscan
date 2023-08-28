import api from '@/services/api';
import { IAccountResponse } from '@/types';
import { generateEmptyAccountResponse } from '../account';

const getAccount = async (hash: string): Promise<IAccountResponse> => {
  const res = await api.get({
    route: `address/${hash}`,
  });

  if (res.error === 'cannot find account in database') {
    return generateEmptyAccountResponse(hash);
  }

  return res;
};

export default getAccount;
