import React from 'react';

import PageNProgress from 'next-styled-nprogress';

const NProgress: React.FC = () => {
  const props = {
    color: '#EE3F71',
    showSpinner: false,
    height: '2px',
    delay: 200,
  };

  return <PageNProgress {...props} />;
};

export default NProgress;
