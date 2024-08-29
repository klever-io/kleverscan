import { WhiteTick } from '@/assets/icons';
import { useMobile } from '@/contexts/mobile';
import { PropsWithChildren } from 'react';
import { StepsContainer, StepsItem, StepsItemContainer } from '../styles';

export const StepsBasics: React.FC<PropsWithChildren<any>> = ({
  selectedStep,
  steps,
  advancedStepsLabels,
  basicTotalSteps,
  advancedStepsIndex,
}) => {
  const { isMobile, isTablet } = useMobile();

  if (selectedStep >= 1 && selectedStep < 8 && (isMobile || isTablet)) {
    return (
      <StepsContainer>
        {steps.map((_: any, index: number) => {
          if (index < 7) {
            return (
              <StepsItem
                key={index}
                isDone={selectedStep - 1 > index}
                selected={selectedStep - 1 === index}
              >
                {selectedStep - 1 <= index && index + 1}
                {selectedStep - 1 > index && <WhiteTick />}
              </StepsItem>
            );
          }
        })}
      </StepsContainer>
    );
  }
  if (selectedStep >= 9 && isTablet && selectedStep !== steps.length - 1) {
    return (
      <StepsContainer advancedSteps>
        {advancedStepsLabels.map((label: string, index: number) => {
          if (index < basicTotalSteps) {
            return (
              <StepsItemContainer key={index + label}>
                <StepsItem
                  isDone={selectedStep > advancedStepsIndex[index]}
                  selected={selectedStep === advancedStepsIndex[index]}
                >
                  {selectedStep <= advancedStepsIndex[index] && index + 1}
                  {selectedStep > advancedStepsIndex[index] && <WhiteTick />}
                </StepsItem>
                <span>{label}</span>
              </StepsItemContainer>
            );
          }
        })}
      </StepsContainer>
    );
  }

  return <></>;
};
