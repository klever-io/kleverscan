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
import { TbArrowsLeftRight, TbShieldCheck } from 'react-icons/tb';
import { getNetwork } from '@/utils/networkFunctions';
import { isKVMAvailable } from '@/utils/kvm';
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
export const network = getNetwork();

const isThirdPartyValidationEnabled =
  process.env.NEXT_PUBLIC_ENABLE_CONTRACT_VALIDATION === 'true' &&
  process.env.NEXT_PUBLIC_ENABLE_3RD_PARTY_VALIDATION === 'true';

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
  ...(isKVMAvailable(network)
    ? [
        {
          name: 'Smart Contracts',
          pathTo: '/smart-contracts',
          Icon: TickSquare,
        },
      ]
    : [
        {
          name: 'Validators',
          pathTo: '/validators',
          Icon: TickSquare,
        },
      ]),
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
      ...(isKVMAvailable(network)
        ? [
            {
              name: 'Validators',
              pathTo: '/validators',
              Icon: TickSquare,
            },
          ]
        : []),
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
        pathTo: '/ito',
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
      ...(isThirdPartyValidationEnabled
        ? [
            {
              name: 'Contract Validator',
              pathTo: '/contract-validator',
              Icon: TbShieldCheck,
            },
          ]
        : []),
      {
        name: 'Marketplaces',
        pathTo: '/marketplaces',
        Icon: MdOutlineLocalMall,
      },
      {
        name: 'Create Transaction',
        pathTo: '/create-transaction',
        Icon: Send,
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
