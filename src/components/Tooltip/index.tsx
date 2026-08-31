import { PropsWithChildren } from 'react';
import { IconHelp } from '@/assets/help';
import { ICustomStyles } from '@/types/index';
import React, { useEffect, useId, useState } from 'react';
import { StyledTooltip, ToolTipSpan } from './styles';

interface ITooltipProps {
  msg: string;
  /**
   * @deprecated Pass the trigger as children instead. Call sites hand over a
   * fresh arrow per render, which is a fresh component type, so React remounts
   * the trigger on every render.
   */
  Component?: React.FC<PropsWithChildren>;
  customStyles?: ICustomStyles;
  minMsgLength?: number;
  maxVw?: number;
  /**
   * Opt-in: the trigger joins the tab order and the tooltip opens on focus,
   * for tooltips whose message is not readable anywhere else on the page.
   * Off by default so existing hover-hint tooltips do not become extra tab
   * stops.
   */
  focusable?: boolean;
}

const Tooltip: React.FC<PropsWithChildren<ITooltipProps>> = ({
  msg,
  Component,
  children,
  customStyles,
  minMsgLength = 0,
  maxVw,
  focusable = false,
}) => {
  const [displayMessage, setDisplayMessage] = useState(false);
  // Every instance used to anchor on the shared `.button-tooltip` class, so
  // each one bound every trigger on the page. This scopes it to its own.
  const anchorId = useId();
  const trigger = children ?? (Component ? <Component /> : null);
  const parsedMsgs = msg.split('\n');

  // WCAG 1.4.13: content shown on hover or focus must be dismissible without
  // moving either. Keyboard events go to the FOCUSED element, and hover-only
  // tooltips hold no focus, so the span handler below cannot reach them: a
  // document listener, alive only while a tip is showing, covers that case.
  useEffect(() => {
    if (!displayMessage) return;
    const dismiss = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDisplayMessage(false);
    };
    document.addEventListener('keydown', dismiss);
    return () => document.removeEventListener('keydown', dismiss);
  }, [displayMessage]);

  return (
    <ToolTipSpan
      className="button-tooltip"
      data-tooltip-anchor={anchorId}
      onMouseOver={() => setDisplayMessage(true)}
      onMouseLeave={() => setDisplayMessage(false)}
      // The focused-trigger path: same dismissal, plus it stops propagation
      // so a surrounding dialog's Escape does not also fire while a tip is
      // open under focus.
      onKeyDown={event => {
        if (event.key === 'Escape' && displayMessage) {
          event.stopPropagation();
          setDisplayMessage(false);
        }
      }}
      {...(focusable && {
        tabIndex: 0,
        onFocus: () => setDisplayMessage(true),
        onBlur: () => setDisplayMessage(false),
      })}
      maxVw={maxVw}
    >
      {trigger ? <div>{trigger}</div> : <IconHelp>button</IconHelp>}
      {((trigger && msg.length > minMsgLength) || !trigger) && (
        <StyledTooltip
          anchorSelect={`[data-tooltip-anchor="${anchorId}"]`}
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
