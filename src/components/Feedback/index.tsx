import React, { useEffect } from 'react';
import { CannyContainer, CannyRenderer } from './styles';

const Feedback: React.FC = () => {
  const BoardToken = process.env.CANNY_BOARD_TOKEN;

  useEffect(() => {
    (function (w, d, i, s) {
      function l() {
        if (!d.getElementById(i)) {
          const f = d.getElementsByTagName(s)[0];
          if (f) {
            const e = d.createElement(s);
            e.setAttribute('type', 'text/javascript');
            e.setAttribute('async', 'true');
            e.setAttribute('src', 'https://canny.io/sdk.js');
            f.parentNode?.insertBefore(e, f);
          }
        }
      }
      if ('function' != typeof w.Canny) {
        const c: any = function (...args: any[]) {
          c.q.push(args);
        };
        (c.q = []),
          (w.Canny = c),
          'complete' === d.readyState
            ? l()
            : w.attachEvent
            ? w.attachEvent('onload', l)
            : w.addEventListener('load', l, false);
      }
    })(window, document, 'canny-jssdk', 'script');

    window.Canny('render', {
      boardToken: BoardToken,
      basePath: '/feedback', // See step 2
      ssoToken: '', // See step 3,
      theme: 'light', // options: light [default], dark, auto
    });
  }, []);

  return (
    <CannyContainer>
      <CannyRenderer data-canny />
    </CannyContainer>
  );
};

export default Feedback;
