import Success from './success.svg';
import Pending from './pending.svg';
import Error from './error.svg';
import { ImCancelCircle } from 'react-icons/im';

const getStatusIcon = (status: string): any => {
  switch (status) {
    case 'success':
      return Success;
    case 'pending':
      return Pending;
    case 'error':
      return Error;
    default:
      return ImCancelCircle;
  }
};

export { getStatusIcon };
