import api from '@/services/api';

const getSmartContract = async (contractAddress: string) => {
  try {
    const res = await api.get({
      route: `sc/${contractAddress}`,
    });

    if (!res.error || res.error === '') {
      const data = {
        ...res,
        data: { sc: res.data.sc },
        pagination: res.pagination,
      };

      return data;
    }
  } catch (error) {
    console.error('Error fetching smart contract data:', error);
  }
};

export default getSmartContract;
