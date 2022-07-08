import {
  Category,
  Graph,
  Send,
  TwoUser,
  Compass,
  TickSquare,
  Proposal,
} from '@/assets/icons';

export interface INavbarItem {
  name: string;
  pathTo: string;
  Icon: any;
  onClick?(): void;
  pages?: INavbarItem[]
}

export const heightLimit = 70; // pixels
export const navbarHeight = 5; // rem
export const navbarPadding = '1rem 17.5rem';

const navbarItems: INavbarItem[] = [
  {
    name: 'Blocks',
    pathTo: '/blocks',
    Icon: Category,
  },
  {
    name: 'Accounts',
    pathTo: '/accounts',
    Icon: TwoUser,
  },
  {
    name: 'Transactions',
    pathTo: '/transactions',
    Icon: Send,
  },
  {
    name: 'Assets',
    pathTo: '/assets',
    Icon: Graph,
  },
  {
    name: 'Validators',
    pathTo: '/validators',
    Icon: TickSquare,
  },
  {
    name: 'More',
    pathTo: '',
    Icon: Graph,
    pages: [
      // REMOVE COMMENT WHEN NODES PAGE FIXED
      // {
      //   name: 'Nodes',
      //   pathTo: '/nodes',
      //   Icon: Compass,
      // },
      {
        name: 'Proposals',
        pathTo: '/proposals',
        Icon: Proposal,
      },
      {
        name: 'Charts',
        pathTo: '/charts',
        Icon: Graph,
      },
    ],
  },
];

export { navbarItems };
