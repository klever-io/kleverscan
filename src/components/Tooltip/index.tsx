import { PropsWithChildren } from 'react';
import { IconHelp } from '@/assets/help';
import { ICustomStyles } from '@/types/index';
import React, { useState } from 'react';
import { StyledTooltip, ToolTipSpan } from './styles';

interface ITooltipProps {
  msg: string;
  Component?: React.FC<PropsWithChildren>;
  customStyles?: ICustomStyles;
  minMsgLength?: number;
  maxVw?: number;
}

const Tooltip: React.FC<PropsWithChildren<ITooltipProps>> = ({
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
      className="button-tooltip"
      onMouseOver={() => setDisplayMessage(true)}
      onMouseLeave={() => setDisplayMessage(false)}
      maxVw={maxVw}
    >
      {Component ? <div>{Component({})}</div> : <IconHelp>button</IconHelp>}
      {((Component && msg.length > minMsgLength) || !Component) && (
        <StyledTooltip
          anchorSelect=".button-tooltip"
          displayMsg={displayMessage}
          place={customStyles?.place || 'top'}
          delayShow={customStyles?.delayShow || 300}
          offset={customStyles?.offset}
        >
          {parsedMsgs.map((parsedMsg, index) => (
            <span key={parsedMsg} style={{ color: 'white' }}>
              {parsedMsg}
              {index + 1 !== parsedMsgs.length && <br />}
            </span>
          ))}
        </StyledTooltip>
      )}
    </ToolTipSpan>
  );
};

export default Tooltip;
