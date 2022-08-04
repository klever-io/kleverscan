import React from 'react';
import { IconType } from 'react-icons';
import { IconContainer, TooltipContainer } from './styles';

interface IIconTooltipProps {
  data?: string;
  tooltip?: string;
  Icon: IconType;
  handleClick?: () => void;
}

const IconTooltip: React.FC<IIconTooltipProps> = ({
  tooltip = 'Text',
  Icon,
  handleClick,
}) => {
  return (
    <TooltipContainer tooltip={tooltip}>
      <IconContainer onClick={handleClick}>{<Icon />}</IconContainer>
    </TooltipContainer>
  );
};

export default IconTooltip;
