import { ISection } from '@/components/Form';

const claimContract = (
  labelId: string,
  inputValue: string | undefined,
): ISection[] => {
  const section = [] as ISection[];
  labelId !== '' &&
    section.push({
      fields: [
        {
          label: labelId,
          props: {
            required: true,
            value: inputValue || undefined,
          },
        },
      ],
    });

  return section;
};

export default claimContract;
