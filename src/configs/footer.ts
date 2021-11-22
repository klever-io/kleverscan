export interface IContent {
  title: string;
  infoLinks: IInfoLink[];
}

export interface IInfoLink {
  name: string;
  href: string;
}

export interface ISocial {
  name: string;
  link: string;
}

const description =
  'Klever is a multi-crypto wallet with an intuitive and elegant interface that offers a safer, faster and smarter cryptocurrency experience for all users worldwide.';

const socials: ISocial[] = [
  {
    name: 'Facebook',
    link: 'https://www.facebook.com/klever.io',
  },
  {
    name: 'Twitter',
    link: 'https://twitter.com/klever_io',
  },
  {
    name: 'Discord',
    link: 'https://discord.gg/klever-io',
  },
  {
    name: 'Instagram',
    link: 'https://instagram.com/klever.io',
  },
  {
    name: 'Telegram',
    link: 'https://t.me/Klever_io',
  },
];

const contents: IContent[] = [
  {
    title: 'Klever Exchange',
    infoLinks: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Use', href: '#' },
      { name: 'WhitePaper', href: '#' },
      { name: 'Trading Fees', href: '#' },
      { name: 'Token List', href: '#' },
    ],
  },
  {
    title: 'Klever Wallet App',
    infoLinks: [
      { name: 'Roadmap', href: '#' },
      { name: 'Help Center', href: '#' },
    ],
  },
  {
    title: 'Klever Ecosystem',
    infoLinks: [
      { name: 'WhitePaper', href: '#' },
      { name: 'Klever News', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Klever Finance', href: '#' },
    ],
  },
];

const version = '1.0.6';

export { socials, description, contents, version };
