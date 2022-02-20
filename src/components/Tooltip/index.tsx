import { IconHelp } from '@/assets/help';
import React from 'react';

import ReactTooltip from 'react-tooltip';

interface ITooltipProps {
  msg: string;
}

const Tooltip: React.FC<ITooltipProps> = ({ msg }) => {
  return (
    <div>
      <IconHelp data-tip data-for="buttonTooltip">
        button
      </IconHelp>
      <ReactTooltip
        id="buttonTooltip"
        place="bottom"
        effect="solid"
        type="info"
        backgroundColor="#7B7DB2"
      >
        {msg}
      </ReactTooltip>
    </div>
  );
};

export default Tooltip;
