import {
  BoxIcon,
  Home,
  ClipboardList,
  Calculator,
  Package,
  CalendarDays,
  Archive,
  Inbox,
  ContactRound,
  CircleUserRound,
  Settings,
} from 'lucide-react';

export const sidebarMenu = [
  {
    name: 'Dashboard',
    iconElement: <Home />,
    to: '/dashboard',
  },
  {
    name: 'Order',
    iconElement: <ClipboardList />,
    to: '/order',
  },
  {
    name: 'Cashier',
    iconElement: <Calculator />,
    to: '/cashier',
  },
  {
    name: 'Product',
    iconElement: <Package />,
    to: '/product',
  },
  {
    name: 'Reservation',
    iconElement: <CalendarDays />,
    to: '/reservation',
  },
  {
    name: 'Inventory',
    iconElement: <Archive />,
    to: '/inventory',
  },
  {
    name: 'Purchase',
    iconElement: <Inbox />,
    to: '/purchase',
  },
  {
    name: 'Report',
    iconElement: <BoxIcon />,
    to: '/report',
  },
  {
    name: 'User Manager',
    iconElement: <ContactRound />,
    to: 'user-manager',
  },
  {
    name: 'Account',
    iconElement: <CircleUserRound />,
    to: '/account',
  },
  {
    name: 'Settings',
    iconElement: <Settings />,
    to: '/settings',
  },
];
