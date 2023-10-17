import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Container,
  IconContainer,
  ItemsContainer,
  ItemsContent,
  StyledImage,
} from './styles';

interface IFooterItems {
  name: string;
  icon: string;
  url: string;
}

const SelectIcons: React.FC<IFooterItems> = ({ name, icon, url }) => {
  const router = useRouter();
  return (
    <ItemsContent>
      <Link href={url}>
        <a>
          <IconContainer
            $itemSelected={router.pathname === url}
            blockIcon={name === 'Blocks'}
          >
            <StyledImage
              $itemSelected={router.pathname === url}
              src={icon}
              alt={`nav-${icon}`}
              width={24}
              height={24}
            />
            <p>{name}</p>
          </IconContainer>
        </a>
      </Link>
    </ItemsContent>
  );
};

export const MobileNavBar: React.FC = () => {
  const footerItems: IFooterItems[] = [
    {
      name: 'Home',
      icon: '/fill.svg',
      url: '/',
    },
    {
      name: 'Assets',
      icon: '/graph-void.svg',
      url: '/assets',
    },
    {
      name: 'Transactions',
      icon: '/send-void.svg',
      url: '/transactions',
    },
    {
      name: 'Accounts',
      icon: '/users-void.svg',
      url: '/accounts',
    },
    {
      name: 'Blocks',
      icon: '/block-chain-void.svg',
      url: '/blocks',
    },
  ];
  return (
    <Container>
      <ItemsContainer>
        {footerItems.map((item, key) => (
          <SelectIcons key={String(key)} {...item} />
        ))}
      </ItemsContainer>
    </Container>
  );
};
