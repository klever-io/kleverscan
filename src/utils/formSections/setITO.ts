import { ISection } from 'components/Form';

const setITOContract = (): ISection[] => {
  const section = [] as ISection[];

  section.push(
    {
      fields: [
        {
          label: 'KDA',
          props: {
            required: true,
            tooltip: 'Target asset',
          },
        },
      ],
    },
  );

  return section;
};
  
export default setITOContract;
