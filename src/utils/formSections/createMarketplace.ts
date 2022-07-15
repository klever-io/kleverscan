import { ISection } from 'components/Form';

const createMarketplaceContract = (): ISection[] => {
  const section = [] as ISection[];

  section.push({
    fields: [
      { label: 'Name', props: { required: true } },
      {
          label: 'Referral Address',
      },
      {
          label: 'Referral Percentage',
          props: {
            type: 'number',
          },
      },
    ],
  });

  return section;
};
  
export default createMarketplaceContract;
  