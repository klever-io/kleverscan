import {
  Discord,
  Facebook,
  Github,
  Instagram,
  Telegram,
  Twitter,
} from '@/assets/social';

export interface IContent {
  title: string;
  infoLinks: IInfoLink[];
}

export interface IInfoLink {
  name: string;
  href: string;
}

export interface ISocial {
  Icon: any;
  link: string;
}

const description =
  'Klever Explorer is our main platform to visualize assets, blocks, nodes, accounts and transactions in an intuitive and interactive manner. Everything happening in KleverChain can be consulted here on our Explorer.';

const socials: ISocial[] = [
  {
    Icon: Facebook,
    link: 'https://www.facebook.com/klever.io',
  },
  {
    Icon: Twitter,
    link: 'https://twitter.com/klever_io',
  },
  {
    Icon: Discord,
    link: 'https://discord.gg/klever-io',
  },
  {
    Icon: Instagram,
    link: 'https://instagram.com/klever.io',
  },
  {
    Icon: Telegram,
    link: 'https://t.me/Klever_io',
  },
  {
    Icon: Github,
    link: 'https://github.com/Klever-io',
  },
];

const contents: IContent[] = [
  {
    title: 'Klever Exchange',
    infoLinks: [
      { name: 'Privacy Policy', href: 'https://klever.io/privacy-policy' },
      { name: 'Terms of Use', href: 'https://klever.io/terms-of-use' },
      {
        name: 'WhitePaper',
        href: 'https://bc.klever.finance/wp',
      },
      { name: 'Trading Fees', href: 'https://klever.io/en/fees' },
      { name: 'Token List', href: 'https://klever.io/markets' },
    ],
  },
  {
    title: 'Klever Wallet App',
    infoLinks: [
      { name: 'Roadmap', href: 'https://klever.org/#roadmap' },
      { name: 'Help Center', href: 'https://support.klever.org/' },
    ],
  },
  {
    title: 'Klever Ecosystem',
    infoLinks: [
      {
        name: 'WhitePaper',
        href: 'https://klever.org/s/Klever-Blockchain-Whitepaper-v20-lr.pdf',
      },
      { name: 'Klever News', href: 'https://klevernews.com/' },
      { name: 'Careers', href: 'https://klever.compleo.com.br/' },
      { name: 'Klever Finance', href: 'https://klever.org' },
      { name: 'Klever Docs', href: 'https://docs.klever.finance/' },
    ],
  },
];

const version = '1.0.6';

export { socials, description, contents, version };
