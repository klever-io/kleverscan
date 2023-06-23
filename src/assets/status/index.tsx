import { Status } from '@/components/Table/styles';
import { ImCancelCircle } from 'react-icons/im';
import Error from './error2.svg';
import Pending from './pending.svg';
import Success from './success2.svg';

const getStatusIcon = (status: string): any => {
  switch (status) {
    case 'ApprovedProposal':
      return Success;
    case 'DeniedProposal':
      return Error;
    case 'success':
      return Success;
    case 'pending':
    case 'ActiveProposal':
    case 'inactive':
      return Pending;
    case 'fail':
      return Error;
    default:
      return ImCancelCircle;
  }
};

const statusWithIcon = (action: boolean): JSX.Element => {
  const StatusIcon = getStatusIcon(action ? 'success' : 'fail');

  return (
    <Status status={action ? 'success' : 'fail'} key={String(action)}>
      <StatusIcon />
      <p>{action ? 'Yes' : 'No'}</p>
    </Status>
  );
};

export { getStatusIcon, statusWithIcon };
