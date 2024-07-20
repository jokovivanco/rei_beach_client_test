import { InboundResponse } from '@/types/inbound-types';
import { OutboundResponse } from '@/types/outbound-types';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// shadcn
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getNextSku(sku: string): string {
  // Memisahkan prefix huruf dan angka
  const prefix = sku.replace(/[0-9]/g, '');
  const number = parseInt(sku.replace(/[^0-9]/g, ''), 10);

  // Menambahkan 1 ke angka
  const nextNumber = number + 1;

  // Membuat string format untuk padding
  const formatString = `000000${nextNumber}`;

  // Menggabungkan prefix dengan angka yang sudah di-padding
  const nextSku = prefix + formatString.slice(-5);

  return nextSku;
}

export const formatToRupiah = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const parseRupiah = (value: string) => {
  return Number(value.replace(/[^\d]/g, ''));
};

export const formatDate = (datestring: string): string => {
  const date = new Date(datestring);

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const formattedDate = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year.toString()}`;

  return formattedDate;
};

type Bound = Array<InboundResponse | OutboundResponse>;

export const groupInOutBoundByMonth = (
  bounds: Bound,
  year: number,
): Array<{ month: string; year: number; bounds: Bound }> => {
  const groupedBounds: { [key: string]: Bound } = {};

  bounds
    .filter((bound) => new Date(bound.issued_at).getFullYear() === year)
    .forEach((bound) => {
      const date = new Date(bound.issued_at);
      const monthKey = date.toISOString().slice(0, 7); // Format: YYYY-MM
      if (!groupedBounds[monthKey]) {
        groupedBounds[monthKey] = [];
      }
      groupedBounds[monthKey].push(bound);
    });

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mei',
    'Jun',
    'Jul',
    'Agu',
    'Sep',
    'Okt',
    'Nov',
    'Des',
  ];

  return Object.entries(groupedBounds)
    .map(([monthKey, bounds]) => {
      const [, monthNumber] = monthKey.split('-');
      const monthIndex = parseInt(monthNumber, 10) - 1;
      return {
        month: monthNames[monthIndex],
        year,
        bounds,
      };
    })
    .sort((a, b) => monthNames.indexOf(a.month) - monthNames.indexOf(b.month));
};
