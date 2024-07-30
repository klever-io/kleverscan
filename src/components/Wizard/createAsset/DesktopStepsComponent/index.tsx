import { WhiteTick } from '@/assets/icons';
import { useMobile } from '@/contexts/mobile';
import { PropsWithChildren, useEffect, useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import {
  AdvancedStepsDesktop,
  DesktopBasicSteps,
  DesktopStepsLabel,
  StepsContainer,
  StepsContainerDesktop,
  StepsExpandedContainer,
  StepsItem,
  StepsItemContainerDesktop,
} from '../styles';

export const DesktopStepsComponent: React.FC<PropsWithChildren<any>> = ({
  selectedStep,
  setSelectedStep,
  steps,
  advancedStepsLabels,
  basicTotalSteps,
  advancedStepsIndex,
  basicStepsLabels,
  basicStepsInfo,
  titleName = 'Basic Information',
  isNFT = true,
}) => {
  const { isMobile, isTablet } = useMobile();
  const [showBasicSteps, setShowBasicSteps] = useState(false);

  const handleSelectStep = (index: number) => {
    if (steps[index].isDone) setSelectedStep(index + 1);
  };

  useEffect(() => {
    const assetStep = !isNFT ? 9 : 8;
    if (selectedStep >= assetStep) {
      setShowBasicSteps(true);
    }
    if (selectedStep < assetStep) {
      setShowBasicSteps(false);
    }
    if (!advancedStepsLabels) {
      setShowBasicSteps(false);
    }
  }, [selectedStep]);

  if (!isMobile && !isTablet && selectedStep !== 0) {
    return (
      <StepsContainerDesktop>
        <DesktopBasicSteps>
          <div>
            <span>{titleName}</span>
            <span>STEPS</span>
          </div>
          <button
            type="button"
            onClick={() => setShowBasicSteps(!showBasicSteps)}
          >
            {showBasicSteps ? <IoIosArrowDown /> : <IoIosArrowUp />}
          </button>
        </DesktopBasicSteps>
        <StepsExpandedContainer isHidden={showBasicSteps}>
          <StepsContainer>
            {steps.map((_: any, index: number) => {
              if (index < basicTotalSteps) {
                return (
                  <StepsItemContainerDesktop
                    key={index}
                    selected={selectedStep - 1 === index}
                  >
                    <StepsItem
                      isDone={selectedStep - 1 > index}
                      selected={selectedStep - 1 === index}
                    >
                      {selectedStep - 1 <= index && index + 1}
                      {selectedStep - 1 > index && <WhiteTick />}
                    </StepsItem>
                    <DesktopStepsLabel
                      onClick={() => handleSelectStep(index)}
                      isUpperCase={basicStepsLabels[index]
                        .toLowerCase()
                        .includes('ticker')}
                    >
                      <span>{basicStepsLabels[index]}</span>
                      <span>
                        {steps[index].isDone ? basicStepsInfo[index] : ''}
                      </span>
                    </DesktopStepsLabel>
                  </StepsItemContainerDesktop>
                );
              }
            })}
          </StepsContainer>
        </StepsExpandedContainer>
        {advancedStepsLabels && (
          <AdvancedStepsDesktop darkText={selectedStep < 9}>
            <div>
              <span>Advanced Options</span>
              <span>STEPS</span>
            </div>
            <StepsExpandedContainer
              isHidden={selectedStep < 9 && !showBasicSteps}
            >
              <StepsContainer>
                {advancedStepsLabels.map((_: string, index: number) => {
                  if (index < basicTotalSteps) {
                    return (
                      <StepsItemContainerDesktop
                        key={index}
                        selected={selectedStep - 1 === index}
                      >
                        <StepsItem
                          isDone={selectedStep > advancedStepsIndex[index]}
                          selected={selectedStep === advancedStepsIndex[index]}
                        >
                          {selectedStep <= advancedStepsIndex[index] &&
                            index + 1}
                          {selectedStep > advancedStepsIndex[index] && (
                            <WhiteTick />
                          )}
                        </StepsItem>
                        <div>
                          <span>{advancedStepsLabels[index]}</span>
                          <span />
                        </div>
                      </StepsItemContainerDesktop>
                    );
                  }
                })}
              </StepsContainer>
            </StepsExpandedContainer>
          </AdvancedStepsDesktop>
        )}
      </StepsContainerDesktop>
    );
  }

  return <></>;
};
