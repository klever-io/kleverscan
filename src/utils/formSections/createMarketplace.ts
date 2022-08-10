import { ISection } from 'components/Form';

const createMarketplaceContract = (): ISection[] => {
  const section = [] as ISection[];

  section.push({
    fields: [
      {
        label: 'Name',
        props: {
          required: true,
          tooltip: 'Marketplace name',
        },
      },
      {
        label: 'Referral Address',
        props: {
          tooltip: 'Royalties receiving address',
        },
      },
      {
        label: 'Referral Percentage',
        props: {
          type: 'number',
          tooltip: 'Royalties percentage (precision 2)',
        },
      },
    ],
  });

  return section;
};

export default createMarketplaceContract;
