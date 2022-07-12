import { ISection } from 'components/Form';

const createMarketplaceContract = (): ISection[] => {
  const section = [] as ISection[];

  section.push({
    fields: [
      { label: 'Name', props: { required: true } },
      {
          label: 'Referral Address',
          props: {
            required: true,
          },
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
  
export default createMarketplaceContract;
  