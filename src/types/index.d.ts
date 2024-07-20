import { ReactNode } from 'react';

export type WithData<T> = {
  data: T;
};

export type GeneralCountResponse = {
  user: number;
  category: number;
  item: number;
};

export type ReactChildren = {
  children: ReactNode;
};

export type TSelect = {
  name: string;
  value: string;
};
