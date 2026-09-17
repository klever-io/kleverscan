import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

interface ISpotlightContext {
  isOpen: boolean;
  openSpotlight: (initialQuery?: string) => void;
  closeSpotlight: () => void;
  toggleSpotlight: () => void;
  initialQuery: string;
}

const SpotlightContext = createContext({} as ISpotlightContext);

export const SpotlightProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [initialQuery, setInitialQuery] = useState('');

  const openSpotlight = useCallback((query = '') => {
    setInitialQuery(query);
    setIsOpen(true);
  }, []);

  const closeSpotlight = useCallback(() => {
    setIsOpen(false);
    setInitialQuery('');
  }, []);

  const toggleSpotlight = useCallback(() => {
    setIsOpen(prev => {
      if (prev) {
        setInitialQuery('');
      }
      return !prev;
    });
  }, []);

  useEffect(() => {
    const isEditableTarget = (target: EventTarget | null): boolean => {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
        return true;
      }
      return target.isContentEditable;
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const mod = event.metaKey || event.ctrlKey;

      if (mod && key === 'k') {
        event.preventDefault();
        setIsOpen(prev => {
          if (prev) {
            setInitialQuery('');
            return false;
          }
          return true;
        });
        return;
      }

      // Spotlight-style slash when not typing in a field
      if (
        key === '/' &&
        !mod &&
        !event.altKey &&
        !isEditableTarget(event.target)
      ) {
        event.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const values = useMemo(
    () => ({
      isOpen,
      openSpotlight,
      closeSpotlight,
      toggleSpotlight,
      initialQuery,
    }),
    [isOpen, openSpotlight, closeSpotlight, toggleSpotlight, initialQuery],
  );

  return (
    <SpotlightContext.Provider value={values}>
      {children}
    </SpotlightContext.Provider>
  );
};

export const useSpotlight = (): ISpotlightContext =>
  useContext(SpotlightContext);
