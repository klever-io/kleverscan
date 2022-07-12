import { ISection } from 'components/Form';

const configITOContract = (): ISection[] => {
  const section = [] as ISection[];

  section.push(
    {
      fields: [
        { label: 'AssetID', props: { required: true } },
        { label: 'Receiver Address', props: { required: true } },
        { label: 'Status', props: { type: 'number', required: true } },
        { label: 'Max Amount', props: { type: 'number', required: true } },
    ],
    },
  );

  return section;
};
  
export default configITOContract;
