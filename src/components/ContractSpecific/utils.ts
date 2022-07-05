import { TransactionType } from '@klever/sdk';

const getNonce = async (address: string): Promise<number> => {
  const request = await fetch(
    `${
      process.env.DEFAULT_NODE_HOST || 'https://node.mainnet.klever.finance'
    }/address/${address}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  const response = await request.json();

  return response.data.account.Nonce;
};

const getType = (rawType: string): TransactionType => {
  let type = rawType.substring(0, rawType.length - 8);

  switch (type) {
    case 'Vote':
      type = 'Votes';
      break;
    case 'ValidatorConfig':
      type = 'ConfigValidator';
      break;
    case 'Buy':
      type = 'BuyOrder';
      break;
    case 'Sell':
      type = 'SellOrder';
      break;
  }

  return TransactionType[type];
};

export { getNonce, getType };
