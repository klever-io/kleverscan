import { ISection } from '@/components/Form';
import { IParamList } from '@/types/index';

const proposalContract = (paramsList?: IParamList[]): ISection[] => {
  const section = [] as ISection[];

  section.push({
    fields: [
      {
        label: 'Description',
        props: {
          tooltip: 'Outline the ideas of the proposal',
          type: 'textarea',
          span: 2,
        },
      },
      {
        label: 'Epochs Duration',
        props: {
          required: true,
          tooltip:
            'The time the proposal will be available for voting ( each epoch has 6h )',
          span: 2,
        },
      },
    ],
  });

  return section;
};

export default proposalContract;
