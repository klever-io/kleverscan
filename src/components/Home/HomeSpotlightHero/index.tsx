import { Search } from '@/assets/icons';
import { useSpotlight } from '@/contexts/spotlight';
import { PropsWithChildren, useEffect, useState } from 'react';
import {
  HeroButton,
  HeroHint,
  HeroIcon,
  HeroKbd,
  HeroLabel,
  HeroWrap,
} from './styles';

/**
 * Home entry CTA for search. Looks like a search field but only opens Spotlight
 * — no second search pipeline.
 */
const HomeSpotlightHero: React.FC<PropsWithChildren> = () => {
  const { openSpotlight } = useSpotlight();
  const [modKey, setModKey] = useState('⌘');

  useEffect(() => {
    const isApple = /Mac|iPhone|iPad|iPod/i.test(navigator.platform);
    setModKey(isApple ? '⌘' : 'Ctrl');
  }, []);

  return (
    <HeroWrap>
      <HeroButton
        type="button"
        onClick={() => openSpotlight()}
        aria-label="Open spotlight search"
        data-testid="home-spotlight-hero"
      >
        <HeroIcon aria-hidden>
          <Search />
        </HeroIcon>
        <HeroLabel>
          Search address, transaction, block, asset, or jump to a page…
        </HeroLabel>
        <HeroKbd>{modKey}K</HeroKbd>
      </HeroButton>
      <HeroHint>Explorer search — opens Spotlight</HeroHint>
    </HeroWrap>
  );
};

export default HomeSpotlightHero;
