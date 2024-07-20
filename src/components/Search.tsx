import useDebounce from '@/hooks/useDebounce';
import { SearchItemRequest } from '@/types/item-types';
import {
  RegisteredRouter,
  RouteIds,
  useLocation,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { ChangeEvent, useEffect, useState } from 'react';
import { Input } from './ui/input';

interface SearchProps {
  from: RouteIds<RegisteredRouter['routeTree']>;
}

const Search = <T extends { name?: string }>({ from }: SearchProps) => {
  const searchParams = useSearch({ from });
  const { name } = searchParams as T;
  const navigate = useNavigate();
  const [search, setSearch] = useState(name ?? '');
  const debouncedSearch = useDebounce({ value: search, delay: 300 });
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    if (debouncedSearch) {
      navigate({
        search: (old) => ({
          ...old,
          name: debouncedSearch,
        }),
      });
    } else {
      navigate({
        search: (old: SearchItemRequest) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { name, ...withoutName } = old;
          return withoutName;
        },
      });
    }
  }, [debouncedSearch, pathname, navigate]);

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
  }

  return (
    <Input
      value={search}
      placeholder="Cari..."
      onChange={onChange}
      className="max-w-64"
    />
  );
};
export default Search;
