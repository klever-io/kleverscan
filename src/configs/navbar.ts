import { IconType } from 'react-icons/lib';

import { FaConnectdevelop, FaLaravel, FaRegUser } from 'react-icons/fa';
import { DiGitBranch } from 'react-icons/di';
import { BiSort } from 'react-icons/bi';
import { HiDatabase } from 'react-icons/hi';

export interface INavbarItem {
  name: string;
  pathTo: string;
  Icon: IconType;
}

export const heightLimit = 70; // pixels
export const navbarHeight = 5; // rem
export const navbarPadding = '1rem 17.5rem';

export const navbarItems: INavbarItem[] = [
  {
    name: 'Nodes',
    pathTo: '/nodes',
    Icon: FaConnectdevelop,
  },
  {
    name: 'Blocks',
    pathTo: '/blocks',
    Icon: FaLaravel,
  },
  {
    name: 'Accounts',
    pathTo: '/accounts',
    Icon: FaRegUser,
  },
  {
    name: 'Transactions',
    pathTo: '/transactions',
    Icon: DiGitBranch,
  },
  {
    name: 'Transfer',
    pathTo: '/transfer',
    Icon: BiSort,
  },
  {
    name: 'Tokens',
    pathTo: '/tokens',
    Icon: HiDatabase,
  },
];
