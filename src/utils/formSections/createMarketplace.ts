import { ISection } from '@/components/Form';

const createMarketplaceContract = (address = ''): ISection[] => {
  const section = [] as ISection[];

  section.push({
    fields: [
      {
        label: 'Name',
        props: {
          required: true,
        },
      },
      {
        label: 'Referral Address',
        props: {
          tooltip: 'Address that will receive royalties',
          defaultValue: address,
        },
      },
      {
        label: 'Referral Percentage',
        props: {
          type: 'number',
          tooltip: 'Royalties percentage with 2 decimals',
          maxDecimals: 2,
        },
      },
    ],
  });

  return section;
};

export default createMarketplaceContract;
