import { IParamList } from '@/types/index';
import { ISection } from 'components/Form';

const proposalContract = (paramsList?: IParamList[]): ISection[] => {
  const section = [] as ISection[];

  section.push({
    fields: [
      {
        label: 'Description',
        props: {
          tooltip: 'Proposal description',
        },
      },
      {
        label: 'Epochs Duration',
        props: {
          required: true,
          tooltip: 'Proposal epochs duration',
        },
      },
    ],
  });

  return section;
};

export default proposalContract;
