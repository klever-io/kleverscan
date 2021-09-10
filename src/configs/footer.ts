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
        name: 'Website',
        href: '/',
      },
    ],
  },
  {
    title: 'social',
    infoLinks: [
      {
        name: 'Twitter',
        href: '/',
      },
      {
        name: 'Facebook',
        href: '/',
      },
      {
        name: 'Telegram',
        href: '/',
      },
      {
        name: 'Discord',
        href: '/',
      },
      {
        name: 'Medium',
        href: '/',
      },
    ],
  },
];

const version = '1.0.6';

export { contents, version };
