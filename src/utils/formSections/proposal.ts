import { IParamList } from '@/types/index';
import { ISection } from 'components/Form';

const proposalContract = (paramsList?: IParamList[]): ISection[] => {
  const section = [] as ISection[];

  section.push({
    fields: [
      {
        label: 'Description',
        props: {
          tooltip: 'Outline the ideas of the proposal',
        },
      },
      {
        label: 'Epochs Duration',
        props: {
          required: true,
          tooltip:
            'The time the proposal will be available for voting ( each epoch has 6h )',
        },
      },
    ],
  });

  return section;
};

export default proposalContract;
