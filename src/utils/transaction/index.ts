import { ITransaction } from '@klever/sdk-web';

const ApiBroadcastTransactions = async (txs: any) => {
  const res = await fetch(
    `${process.env.DEFAULT_NODE_HOST}/transaction/broadcast`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ txs: [...txs] }),
    },
  );

  return await res.json();
};

export const broadcastTXSuccessful = async (hash: string): Promise<any> => {
  const array = Array.from({ length: 20 }, (_, i) => i);
  let error = '';
  let status = '';

  for (const _ of array) {
    try {
      const fetchPromise = fetch(
        `${
          process.env.DEFAULT_API_HOST || 'https://api.testnet.klever.org'
        }/transaction/${hash}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const res = await fetchPromise;

      const data = await res.json();

      if (data && !data.error) {
        error = '';
        status = data.data.transaction.status;
        break;
      } else if (data.error) {
        error = data;
      }
    } catch (e) {
      error = e as string;
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return { error, status };
};

interface IBroadcastTXandCheckStatusResponse {
  error: string;
  status: string;
  hash: string;
}

export const broadcastTXandCheckStatus = async (
  signedTransaction: ITransaction,
): Promise<IBroadcastTXandCheckStatusResponse> => {
  let hash = '';
  try {
    const { data, error } = await ApiBroadcastTransactions([signedTransaction]);
    if (error.length > 0) {
      throw new Error(error);
    }

    hash = data.txsHashes[0];

    const res = await broadcastTXSuccessful(hash);

    return {
      ...res,
      hash,
    };
  } catch (e) {
    console.error(e);
    return {
      error: e as string,
      status: '',
      hash,
    };
  }
};
