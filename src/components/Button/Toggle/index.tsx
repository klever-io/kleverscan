import { PropsWithChildren } from 'react';
import { ToggleButtonContainer, ToggleButtonIcon } from './styles';

interface IToggleButtonProps {
  active: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  /** Opt-in: names the control and reports its state to assistive tech.
   *  Without it the switch is an unlabelled button, as it has always been. */
  ariaLabel?: string;
}

const ToggleButton: React.FC<PropsWithChildren<IToggleButtonProps>> = ({
  active,
  icon,
  onClick,
  ariaLabel,
}) => {
  return (
    <ToggleButtonContainer active={active} onClick={onClick}>
      <ToggleButtonIcon
        active={active}
        hasIcon={!!icon}
        aria-label={ariaLabel}
        aria-pressed={ariaLabel ? active : undefined}
      >
        {icon ? icon : null}
      </ToggleButtonIcon>
    </ToggleButtonContainer>
  );
};

export default ToggleButton;
