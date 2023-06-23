import api from '@/services/api';
import { IBlockResponse } from '@/types/blocks';

const getBlock = async (nonce: string): Promise<IBlockResponse> =>
  api.get({ route: `block/by-nonce/${nonce}` });

export default getBlock;
