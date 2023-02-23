import { ISection } from 'components/Form';

const transferContract = (isNFT: boolean | undefined): ISection[] => {
  let section = [] as ISection[];

  switch (isNFT) {
    case true:
      section = [];
      section.push({
        fields: [
          {
            label: 'Receiver Address',
          },
        ],
      });
      break;
    default:
      section = [];
      section.push({
        fields: [
          {
            label: 'Amount',
            props: {
              type: 'number',
              required: true,
              tooltip: 'Amount to be sent',
            },
          },
          {
            label: 'Receiver Address',
          },
        ],
      });
      break;
  }

  return section;
};

export default transferContract;
