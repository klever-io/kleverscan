import { ISection } from '@/components/Form';

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
          tooltip: 'New Referral Address',
        },
      },
      {
        label: 'Referral Percentage',
        props: {
          type: 'number',
          tooltip: 'New referral percentage with 2 decimals',
          maxDecimals: 2,
        },
      },
    ],
  });

  return section;
};

export default configMarketplaceContract;
