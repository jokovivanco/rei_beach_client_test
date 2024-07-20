import { BoxIcon, LayersIcon } from 'lucide-react';

export const sidebarMenu = [
  {
    name: 'Dashboard',
    iconElement: <LayersIcon />,
    to: '/dashboard',
  },
  {
    name: 'Order',
    iconElement: <BoxIcon />,
    to: '/order',
  },
  {
    name: 'Cashier',
    iconElement: <BoxIcon />,
    to: '/cashier',
  },
  {
    name: 'Reservation',
    iconElement: <BoxIcon />,
    to: '/reservation',
  },
  {
    name: 'Inventory',
    iconElement: <BoxIcon />,
    to: '/inventory',
  },
  {
    name: 'Purchase',
    iconElement: <BoxIcon />,
    to: '/purchase',
  },
  {
    name: 'Report',
    iconElement: <BoxIcon />,
    to: '/report',
  },
  {
    name: 'User Manager',
    iconElement: <BoxIcon />,
    to: 'user-manager',
  },
  {
    name: 'Account',
    iconElement: <BoxIcon />,
    to: '/account',
  },
];
