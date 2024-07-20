import { BoxIcon, LayersIcon } from 'lucide-react';

export const sidebarLink = [
  {
    name: 'Data Master',
    iconElement: <LayersIcon />,
    menus: [
      {
        name: 'Master Barang',
        to: '/items',
      },
      {
        name: 'Master Kategori',
        to: '/categories',
      },
    ],
  },
  {
    name: 'Data Barang',
    iconElement: <BoxIcon />,
    menus: [
      {
        name: 'Barang Masuk',
        to: '/inbound',
      },
      {
        name: 'Barang Keluar',
        to: '/outbound',
      },
    ],
  },
];
