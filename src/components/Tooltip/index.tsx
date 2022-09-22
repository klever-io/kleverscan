import { IconHelp } from '@/assets/help';
import React, { useState } from 'react';
import { StyledTooltip } from './styles';

interface ITooltipProps {
  msg: string;
  Component?: React.FC;
}

const Tooltip: React.FC<ITooltipProps> = ({ msg, Component }) => {
  const [displayMessage, setDisplayMessage] = useState(false);
  const parsedMsgs = msg.split('\n');

  return (
    <div
      onMouseOver={() => setDisplayMessage(true)}
      onMouseLeave={() => setDisplayMessage(false)}
    >
      <span style={{ display: 'flex' }}>
        {Component ? (
          <div data-tip data-for="buttonTooltip">
            <Component />
          </div>
        ) : (
          <IconHelp data-tip data-for="buttonTooltip">
            button
          </IconHelp>
        )}
        {((Component && msg.length >= 9) || !Component) && (
          <div>
            <StyledTooltip
              displayMsg={displayMessage}
              id="buttonTooltip"
              place="bottom"
              effect="solid"
              type="info"
              backgroundColor="#7B7DB2"
              delayShow={1}
            >
              {parsedMsgs.map((parsedMsg, index) => (
                <span key={index} style={{ color: 'white' }}>
                  {parsedMsg}
                  {index + 1 !== parsedMsgs.length && <br />}
                </span>
              ))}
            </StyledTooltip>
          </div>
        )}
      </span>
    </div>
  );
};

export default Tooltip;
