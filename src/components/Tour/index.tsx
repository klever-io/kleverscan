import { useEffect, useRef, useState } from 'react';
import {
  Arrow,
  BackgroundBlockMobileBar,
  BackgroundBlockNavigation,
  ContainerAttention,
  TourBackground,
  TourContainer,
  TourContent,
  TourTooltip,
} from './styles';

interface ITourProps {
  guideName: string;
  tourTooltip: string;
  side: 'left' | 'right' | 'top' | 'bottom';
  children: React.ReactNode;
  condition?: boolean;
}

const Tour: React.FC<ITourProps> = ({
  side = 'bottom',
  guideName,
  tourTooltip,
  condition,
  children,
}) => {
  const [seen, setSeen] = useState(true);

  const handleClose = () => {
    localStorage.setItem(guideName, 'seen');
    document.documentElement.style.overflow = 'visible';
    setSeen(true);
  };
  useEffect(() => {
    if (localStorage.getItem(guideName) === 'seen') {
      return;
    } else {
      document.documentElement.style.overflow = 'hidden';
      setSeen(false);
    }
  }, [guideName]);
  const tourContentRef = useRef<HTMLDivElement>(null);
  
  return (
    <>
      {(seen || !condition) && <>{children}</>}
      {!seen && condition && (
        <TourContainer key={String(seen)}>
          <ContainerAttention>
            <TourContent
              onClick={handleClose}
              onTouchStart={handleClose}
              ref={tourContentRef}
            >
              {children}
            </TourContent>
          </ContainerAttention>
          <Arrow></Arrow>
          <TourTooltip width={tourContentRef.current?.clientWidth || 0}>
            {tourTooltip}
          </TourTooltip>
          <TourBackground isOpen={!seen} />
          <BackgroundBlockNavigation isOpen={!seen} />
          <BackgroundBlockMobileBar isOpen={!seen} />
        </TourContainer>
      )}
    </>
  );
};

export default Tour;
