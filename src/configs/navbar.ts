import {
  Category,
  Graph,
  Proposal,
  Send,
  TickSquare,
  TwoUser,
} from '@/assets/icons';
import { GiTwoCoins } from 'react-icons/gi';
import { MdFeedback, MdOutlineLocalMall } from 'react-icons/md';
import { RiPenNibFill } from 'react-icons/ri';
import { TbArrowsLeftRight } from 'react-icons/tb';
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

export const isBeta =
  process.env.DEFAULT_NODE_HOST?.includes('devnet') ||
  process.env.DEFAULT_NODE_HOST?.includes('testnet') ||
  process.env.DEFAULT_IS_BETA;

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
        name: 'LaunchPad',
        pathTo: '/launchpad',
        Icon: GiTwoCoins,
      },
      {
        name: 'Encoding Converter',
        pathTo: '/encoding-converter',
        Icon: TbArrowsLeftRight,
      },
      {
        name: 'Verify',
        pathTo: '/verify-signature',
        Icon: TickSquare,
      },
      {
        name: 'Marketplaces',
        pathTo: '/marketplaces',
        Icon: MdOutlineLocalMall,
      },
      {
        name: 'Feedback',
        pathTo: 'https://forum.klever.org/c/kleverchain/requests/7',
        Icon: MdFeedback,
      },
    ],
  },
];

export { navbarItems };
