import { PropsWithChildren } from 'react';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import {
  LanguageContainer,
  LanguageDropdown,
  LanguageDropdownItem,
} from './styles';

const Language: React.FC<PropsWithChildren> = () => {
  const [active, setActive] = useState(false);
  const router = useRouter();

  const closeTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleLanguage = (locale: string) => {
    setActive(false);
    router.locale = locale;

    router.push(router.asPath, router.asPath, {
      locale: router.locale,
    });
  };

  const handleMouseEnter = () => {
    closeTimeout.current !== null && clearTimeout(closeTimeout.current);
    setActive(true);
  };

  const handleMouseLeave = () => {
    closeTimeout.current !== null && clearTimeout(closeTimeout.current);
    closeTimeout.current = setTimeout(() => {
      setActive(false);
    }, 500);
  };

  const dropdownProps = {
    onMouseOver: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
  };

  return (
    <LanguageContainer {...dropdownProps}>
      {router.locale?.slice(-2).toUpperCase()}
      <LanguageDropdown active={active} {...dropdownProps}>
        {router.locales?.map(locale => (
          <LanguageDropdownItem
            onClick={() => handleLanguage(locale)}
            key={locale}
          >
            {locale.toUpperCase()}
          </LanguageDropdownItem>
        ))}
      </LanguageDropdown>
    </LanguageContainer>
  );
};

export default Language;
