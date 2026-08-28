import ToggleButton from '@/components/Button/Toggle';
import {
  getStorageUpdateConfig,
  storageUpdateBlocks,
} from '@/utils/localStorage/localStorageData';
import { useTranslation } from 'next-i18next';
import React, { useEffect, useState } from 'react';
import { AutoUpdateContainer } from './styles';

interface IAutoUpdateProps {
  /** Milliseconds to refetch on while the toggle is on. */
  interval: number;
  onChange: (interval: number) => void;
}

/**
 * The auto-update switch, holding its own on/off state.
 *
 * It sits in the table's `Filters` slot, which the table renders as `<Filters
 * />`: a component built per render would be a new type each time, remounting
 * on every keystroke elsewhere and dropping the toggle's 0.4s transition
 * halfway. So the state lives here and the page is told about changes rather
 * than owning them.
 *
 * localStorage is read after mount, not during render: the server has no
 * localStorage, and reading it while rendering makes the first client paint
 * disagree with the server's.
 */
const AutoUpdate: React.FC<IAutoUpdateProps> = ({ interval, onChange }) => {
  const { t } = useTranslation(['blocks']);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const stored = getStorageUpdateConfig();
    setActive(stored);
    onChange(stored ? interval : 0);
    // Mount only: later changes come from the click below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = (): void => {
    const next = storageUpdateBlocks(active);
    setActive(next);
    onChange(next ? interval : 0);
  };

  const label = t('blocks:List.AutoUpdate', { defaultValue: 'Auto update' });

  return (
    // Not a button around the switch: `ToggleButton` renders one itself, and a
    // nested button is invalid HTML that React reports as a hydration failure.
    // The click here is a convenience on the label text; the switch inside
    // carries the keyboard and assistive-tech side.
    <AutoUpdateContainer onClick={toggle} data-testid="blocks-auto-update">
      <span>{label}</span>
      <ToggleButton active={active} ariaLabel={label} />
    </AutoUpdateContainer>
  );
};

export default AutoUpdate;
