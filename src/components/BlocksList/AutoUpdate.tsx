import ToggleButton from '@/components/Button/Toggle';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { AutoUpdateContainer } from './styles';

interface IAutoUpdateProps {
  active: boolean;
  onToggle: () => void;
}

/**
 * The auto-update switch. Controlled by the page, deliberately stateless: the
 * shared Table zeroes the interval itself on a page change away from 1, and
 * the first version of this control kept its own copy of the state, so it
 * went on showing "on" while nothing refreshed any more.
 */
const AutoUpdate: React.FC<IAutoUpdateProps> = ({ active, onToggle }) => {
  const { t } = useTranslation(['blocks']);
  const label = t('blocks:List.AutoUpdate', { defaultValue: 'Auto update' });

  return (
    // Not a button around the switch: `ToggleButton` renders one itself, and a
    // nested button is invalid HTML that React reports as a hydration failure.
    // The click here is a convenience on the label text; the switch inside
    // carries the keyboard and assistive-tech side.
    <AutoUpdateContainer onClick={onToggle} data-testid="blocks-auto-update">
      <span>{label}</span>
      <ToggleButton active={active} ariaLabel={label} />
    </AutoUpdateContainer>
  );
};

export default AutoUpdate;
