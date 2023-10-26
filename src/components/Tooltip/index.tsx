import { IconHelp } from '@/assets/help';
import { ICustomStyles } from '@/types/index';
import React, { useState } from 'react';
import { StyledTooltip, ToolTipSpan } from './styles';

interface ITooltipProps {
  msg: string;
  Component?: React.FC;
  customStyles?: ICustomStyles;
  minMsgLength?: number;
  maxVw?: number;
}

const Tooltip: React.FC<ITooltipProps> = ({
  msg,
  Component,
  customStyles,
  minMsgLength = 0,
  maxVw,
}) => {
  const [displayMessage, setDisplayMessage] = useState(false);
  const parsedMsgs = msg.split('\n');
  return (
    <ToolTipSpan
      onMouseOver={() => setDisplayMessage(true)}
      onMouseLeave={() => setDisplayMessage(false)}
      maxVw={maxVw}
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
        {((Component && msg.length > minMsgLength) || !Component) && (
          <StyledTooltip
            key={String(displayMessage)}
            displayMsg={displayMessage}
            id="buttonTooltip"
            place={customStyles?.place || 'top'}
            effect="solid"
            type="info"
            backgroundColor="#7B7DB2"
            delayShow={customStyles?.delayShow}
            offset={customStyles?.offset}
          >
            {parsedMsgs.map((parsedMsg, index) => (
              <span key={index} style={{ color: 'white' }}>
                {parsedMsg}
                {index + 1 !== parsedMsgs.length && <br />}
              </span>
            ))}
          </StyledTooltip>
        )}
      </>
    </ToolTipSpan>
  );
};

export default Tooltip;
