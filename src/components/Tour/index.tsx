import { useMobile } from '@/contexts/mobile';
import { ReactPortal, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { IoIosClose } from 'react-icons/io';
import {
  ContainerAttention,
  DismissButton,
  PlacementReference,
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
  const tourContentRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<ReactPortal>();
  const backgroundRef = useRef<ReactPortal>();
  const contentRef = useRef<ReactPortal>();
  const { width } = useMobile();

  const renderCondition =
    tourContentRef.current?.getBoundingClientRect() &&
    JSON.stringify(tourContentRef.current.getBoundingClientRect()) !==
      JSON.stringify({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      });

  useEffect(() => {
    if (renderCondition) {
      document.documentElement.style.overflow = 'hidden';

      tooltipRef.current = createPortal(
        <TourTooltip
          contentWidth={tourContentRef.current?.clientWidth || 0}
          contentHeight={tourContentRef.current?.clientHeight || 0}
          position={tourContentRef.current?.getBoundingClientRect()}
        >
          {tourTooltip}
          <DismissButton onClick={handleClose}>
            <IoIosClose size={'1.2rem'} />
            <span>Dismiss</span>
          </DismissButton>
        </TourTooltip>,
        document.body,
      );

      backgroundRef.current = createPortal(
        <TourBackground isOpen={!seen} />,
        document.body,
      );

      contentRef.current = createPortal(
        <TourContainer
          key={String(seen)}
          contentWidth={tourContentRef.current?.clientWidth || 0}
          contentHeight={tourContentRef.current?.clientHeight || 0}
          position={tourContentRef.current?.getBoundingClientRect()}
        >
          <ContainerAttention>
            <TourContent onClick={handleClose}>{children}</TourContent>
          </ContainerAttention>
        </TourContainer>,
        document.body,
      );
    }
  }, [tourContentRef.current, width]);

  const handleClose = () => {
    localStorage.setItem(guideName, 'seen');
    document.documentElement.style.overflow = 'unset';
    setSeen(true);
  };

  useEffect(() => {
    if (localStorage.getItem(guideName) === 'seen') {
      return;
    } else {
      setSeen(false);
    }
  }, [guideName]);

  return (
    <>
      {(seen || !condition) && <>{children}</>}
      {!seen && condition && (
        <>
          <PlacementReference ref={tourContentRef} isVisibile={seen}>
            {children}
          </PlacementReference>
          {contentRef.current}
          {tooltipRef.current}
          {backgroundRef.current}
        </>
      )}
    </>
  );
};

export default Tour;