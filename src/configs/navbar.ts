import {
  Category,
  Graph,
  Proposal,
  Send,
  TickSquare,
  TwoUser,
} from '@/assets/icons';
import { GiTwoCoins } from 'react-icons/gi';
import { RiPenNibFill } from 'react-icons/ri';

export interface INavbarItem {
  name: string;
  pathTo: string;
  Icon: any;
  onClick?(): void;
  pages?: INavbarItem[];
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
        name: 'Multisign',
        pathTo: '/multisign',
        Icon: RiPenNibFill,
      },
      {
        name: 'Charts',
        pathTo: '/charts',
        Icon: Graph,
      },
      {
        name: 'ITOs',
        pathTo: '/itos',
        Icon: GiTwoCoins,
      },
      // {
      //   name: 'Verify',
      //   pathTo: '/verify-signature',
      //   Icon: TickSquare,
      // },
    ],
  },
];

export { navbarItems };
