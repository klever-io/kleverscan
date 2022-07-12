import { ISection } from 'components/Form';

const withdrawContract = (): ISection[] => {
  const section = [] as ISection[];

  section.push({
    fields: [
      { label: 'AssetID', props: { required: true } },
    ],
  });

  return section;
};

export default withdrawContract;
  