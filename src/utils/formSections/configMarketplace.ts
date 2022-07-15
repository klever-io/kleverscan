import { ISection } from 'components/Form';

const configMarketplaceContract = (): ISection[] => {
  const section = [] as ISection[];

  section.push({
    fields: [
      { label: 'Marketplace ID', props: { required: true } },
      { label: 'Name', props: { required: true } },
      {
        label: 'Referral Address',
      },
      {
          label: 'Referral Percentage',
          props: {
            type: 'number',
            required: true,
          },
      },
    ],
  });

  return section;
};
  
export default configMarketplaceContract;
