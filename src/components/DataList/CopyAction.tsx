import * as clipboard from 'clipboard-polyfill';
import React, { useEffect, useRef, useState } from 'react';
import { MdCheck, MdContentCopy } from 'react-icons/md';
import { ActionButton, VisuallyHidden } from './styles';

interface ICopyActionProps {
  value: string;
  /** Idle control label, e.g. "Copy address". */
  label: string;
  /** Confirmation text, e.g. "Address copied to clipboard". */
  announcement: string;
  large?: boolean;
}

/**
 * Copy control with feedback at the point of action: the icon swaps to a
 * check for 1.2s instead of raising a toast, and a polite live region
 * announces the copy for screen readers.
 */
const CopyAction: React.FC<ICopyActionProps> = ({
  value,
  label,
  announcement,
  large,
}) => {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleCopy = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ): Promise<void> => {
    event.preventDefault();
    event.stopPropagation();
    try {
      await clipboard.writeText(value);
    } catch (error) {
      // Denied permission or an insecure origin: say nothing rather than
      // claiming a copy that did not happen.
      console.error(error);
      return;
    }
    setCopied(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 1200);
  };

  const iconSize = large ? 16 : 14;

  return (
    <ActionButton
      type="button"
      onClick={handleCopy}
      $large={large}
      $success={copied}
      aria-label={label}
      title={copied ? 'Copied' : label}
    >
      {copied ? <MdCheck size={iconSize} /> : <MdContentCopy size={iconSize} />}
      <VisuallyHidden aria-live="polite">
        {copied ? announcement : ''}
      </VisuallyHidden>
    </ActionButton>
  );
};

export default CopyAction;
