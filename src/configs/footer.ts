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

export const walletDonate =
  'klv1eq05kr9fhhjw9lvuprqklhr7qlu6llz775m2l8v4nme4es8trf0qdfs8rs';

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
    title: 'Klever Wallet',
    infoLinks: [
      { name: 'Wallet', href: 'https://klever.io/' },
      { name: 'Privacy Policy', href: 'https://klever.io/privacy-policy/' },
    ],
  },
  {
    title: 'Klever Ecosystem',
    infoLinks: [
      {
        name: 'WhitePaper',
        href: 'https://klever.org/s/Klever-Blockchain-Whitepaper-v20-lr.pdf',
      },
      {
        name: 'Devs Community',
        href: 'https://join.slack.com/t/klever-blockchain/shared_invite/zt-1z69ikw0g-dXtRY7eGTnyRllsCV_YGOw',
      },
      { name: 'Klever.Org', href: 'https://klever.org/' },
      { name: 'Klever Docs', href: 'https://docs.klever.finance/' },
      { name: 'Klever News', href: 'https://klevernews.com/' },
      { name: 'Careers', href: 'https://klever.compleo.com.br/' },
      { name: 'Help Center', href: 'https://support.klever.org/' },
    ],
  },
  {
    title: 'Donate to KleverScan',
    infoLinks: [
      {
        name: 'KLV',
        href: '',
      },
    ],
  },
];

const version = '1.0.6';

export { socials, description, contents, version };
