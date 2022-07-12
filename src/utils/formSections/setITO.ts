import { ISection } from 'components/Form';

const setITOContract = (): ISection[] => {
  const section = [] as ISection[];

  section.push(
    {
      fields: [
        { label: 'AssetID', props: { required: true } },
      ],
    },
  );

  return section;
};
  
export default setITOContract;
