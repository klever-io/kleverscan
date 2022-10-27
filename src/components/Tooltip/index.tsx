import { IconHelp } from '@/assets/help';
import { ICustomStyles } from '@/types/index';
import React, { useState } from 'react';
import { StyledTooltip } from './styles';

interface ITooltipProps {
  msg: string;
  Component?: React.FC;
  customStyles?: ICustomStyles;
}

const Tooltip: React.FC<ITooltipProps> = ({ msg, Component, customStyles }) => {
  const [displayMessage, setDisplayMessage] = useState(false);
  const parsedMsgs = msg.split('\n');

  return (
    <div
      onMouseOver={() => setDisplayMessage(true)}
      onMouseLeave={() => setDisplayMessage(false)}
    >
      {/* tooltip component probably will need a specific outside wrapper for each case  */}
      <>
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
              place={customStyles?.place || 'top'}
              effect="solid"
              type="info"
              backgroundColor="#7B7DB2"
              delayShow={1}
              offset={customStyles?.offset}
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
      </>
    </div>
  );
};

export default Tooltip;
