import Success from './success.svg';
import Pending from './pending.svg';
import Error from './error.svg';

const getStatusIcon = (status: string): any => {
  switch (status) {
    case 'success':
      return Success;
    case 'pending':
      return Pending;
    case 'error':
      return Error;
    default:
      return Error;
  }
};

export { getStatusIcon };
