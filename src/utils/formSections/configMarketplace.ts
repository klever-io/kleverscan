import { ISection } from 'components/Form';

const configMarketplaceContract = (): ISection[] => {
  const section = [] as ISection[];

  section.push({
    fields: [
      {
        label: 'Marketplace Id',
        props: {
          required: true,
          tooltip: 'Target Marketplace ID',
        },
      },
      {
        label: 'Name',
        props: {
          required: true,
          tooltip: 'New marketplace name',
        },
      },
      {
        label: 'Referral Address',
        props: {
          tooltip: 'New referral percentage (precision 2)',
        },
      },
      {
        label: 'Referral Percentage',
        props: {
          type: 'number',
          tooltip: 'New referral address',
        },
      },
    ],
  });

  return section;
};

export default configMarketplaceContract;
