import { ToggleButtonContainer, ToggleButtonIcon } from './styles';

interface IToggleButtonProps {
  active: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
}

const ToggleButton: React.FC<IToggleButtonProps> = ({
  active,
  icon,
  onClick,
}) => {
  return (
    <ToggleButtonContainer active={active} onClick={onClick}>
      <ToggleButtonIcon active={active} hasIcon={!!icon}>
        {icon ? icon : null}
      </ToggleButtonIcon>
    </ToggleButtonContainer>
  );
};

export default ToggleButton;
