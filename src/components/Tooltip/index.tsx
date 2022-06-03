import { IconHelp } from '@/assets/help';
import React, {useState} from 'react';

import ReactTooltip from 'react-tooltip';

interface ITooltipProps {
  msg: string;
}

const Tooltip: React.FC<ITooltipProps> = ({ msg }) => {
  const [displayMessage, setDisplayMessage] = useState(false);

  return (
    <div>
      <div
        onMouseOver={() => setDisplayMessage(true)}
        onMouseLeave={() => setDisplayMessage(false)}
      >
        <IconHelp data-tip data-for="buttonTooltip">
          button
        </IconHelp>
          {displayMessage && 
              <ReactTooltip
              id="buttonTooltip"
              place="bottom"
              effect="solid"
              type="info"
              backgroundColor="#7B7DB2"
            >
              {msg}
            </ReactTooltip>
          }
      </div>
    </div>
  );
};

export default Tooltip;
