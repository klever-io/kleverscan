import { ISection } from 'components/Form';

const ITOTriggerContract = (type?: number | null): ISection[] => {
  const section = [] as ISection[];

  if (isNaN(Number(type)) && type !== null) {
    return [];
  }

  switch (type) {
    case 0:
      break;
    case 1:
      section.push({
        fields: [
          {
            label: 'Status',
            props: {
              required: true,
              tooltip: 'New status of the ITO',
              type: 'dropdown',
              options: [
                {
                  label: 'DefaultITO (0)',
                  value: 0,
                },
                {
                  label: 'ActiveITO (1)',
                  value: 1,
                },
                {
                  label: 'PausedITO (2)',
                  value: 2,
                },
              ],
            },
          },
        ],
      });

      break;
    case 2:
      section.push({
        fields: [
          {
            label: 'Receiver Address',
            props: {
              required: true,
              tooltip: 'Address of the receiver',
            },
          },
        ],
      });
      break;
    case 3:
      section.push({
        fields: [
          {
            label: 'Max Amount',
            props: {
              required: true,
              tooltip: 'Max amount of tokens to be sold',
            },
          },
        ],
      });
      break;
    case 4:
      section.push({
        fields: [
          {
            label: 'Default Limit Per Address',
            props: {
              required: true,
              tooltip: 'Default limit per address',
            },
          },
        ],
      });
      break;
    case 5:
      section.push({
        fields: [
          {
            label: 'Start Time',
            props: {
              required: true,
              tooltip: 'ITO start time',
              type: 'datetime-local',
            },
          },
          {
            label: 'End Time',
            props: {
              required: true,
              tooltip: 'ITO end time',
              type: 'datetime-local',
            },
          },
        ],
      });
      break;
    case 6:
      section.push({
        fields: [
          {
            label: 'Whitelist Status',
            props: {
              required: true,
              tooltip: 'Whitelist status',
              type: 'dropdown',
              options: [
                {
                  label: 'DefaultITO (0)',
                  value: 0,
                },
                {
                  label: 'ActiveITO (1)',
                  value: 1,
                },
                {
                  label: 'PausedITO (2)',
                  value: 2,
                },
              ],
            },
          },
        ],
      });
      break;
    case 7:
    case 8:
      break;
    case 9:
      section.push({
        fields: [
          {
            label: 'Whitelist Start Time',
            props: {
              required: true,
              tooltip: 'Whitelist start time',
              type: 'datetime-local',
            },
          },
          {
            label: 'Whitelist End Time',
            props: {
              required: true,
              tooltip: 'Whitelist end time',
              type: 'datetime-local',
            },
          },
        ],
      });
      break;

    default:
      break;
  }

  return [...section];
};

export default ITOTriggerContract;
