export interface IContent {
  title: string;
  infoLinks: IInfoLink[];
}

export interface IInfoLink {
  name: string;
  href: string;
}

const contents: IContent[] = [
  {
    title: 'explorer',
    infoLinks: [
      {
        name: 'Exchange',
        href: 'https://klever.io/',
      },
      {
        name: 'Klever Finance',
        href: 'https://klever.finance/',
      },
      {
        name: 'NFT Marketplace',
        href: 'https://klevernft.com/',
      },
      {
        name: 'Help Desk',
        href: 'https://klever.zendesk.com',
      },
    ],
  },
  {
    title: 'social',
    infoLinks: [
      {
        name: 'Twitter',
        href: 'https://twitter.com/klever_io',
      },
      {
        name: 'Facebook',
        href: 'https://www.facebook.com/klever.io',
      },
      {
        name: 'Telegram',
        href: 'https://t.me/Klever_io',
      },
      {
        name: 'Discord',
        href: 'https://discord.gg/klever-io',
      },
      {
        name: 'News',
        href: 'https://news.klever.io',
      },
    ],
  },
];

const version = '1.0.6';

export { contents, version };
