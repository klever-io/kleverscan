import { ImCancelCircle } from 'react-icons/im';
import Error from './error.svg';
import Pending from './pending.svg';
import Success from './success.svg';

const getStatusIcon = (status: string): any => {
  switch (status) {
    case 'ApprovedProposal':
      return Success;
    case 'DeniedProposal':
      return Error;
    case 'success':
      return Success;
    case 'pending':
      return Pending;
    case 'fail':
      return Error;
    default:
      return ImCancelCircle;
  }
};

export { getStatusIcon };
