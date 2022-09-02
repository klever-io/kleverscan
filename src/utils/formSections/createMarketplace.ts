import { ISection } from 'components/Form';

const createMarketplaceContract = (): ISection[] => {
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
        },
      },
      {
        label: 'Referral Percentage',
        props: {
          type: 'number',
          tooltip: 'Royalties percentage with 2 decimals',
        },
      },
    ],
  });

  return section;
};

export default createMarketplaceContract;
