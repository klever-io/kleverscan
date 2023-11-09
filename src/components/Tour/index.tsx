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
  const [width, setWidth] = useState(0);
  const tourContentRef = useRef<HTMLDivElement>(null);

  const [tourTooltipPortal, setTourTooltipPortal] = useState<ReactPortal>();
  const [backgroundPortal, setBackgroundPortal] = useState<ReactPortal>();
  const [contentPortal, setContentPortal] = useState<ReactPortal>();

  const handleResize = () => {
    const width = window.innerWidth;
    setWidth(width);
  };

  useEffect(() => {
    const width = window.innerWidth;
    window.addEventListener('resize', handleResize);
    setWidth(width);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  useEffect(() => {
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

    if (renderCondition) {
      document.documentElement.style.overflow = 'hidden';

      setTourTooltipPortal(
        createPortal(
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
        ),
      );

      setBackgroundPortal(
        createPortal(<TourBackground isOpen={!seen} />, document.body),
      );

      setContentPortal(
        createPortal(
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
        ),
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
          {contentPortal}
          {tourTooltipPortal}
          {backgroundPortal}
        </>
      )}
    </>
  );
};

export default Tour;
