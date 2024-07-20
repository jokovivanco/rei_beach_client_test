import { Check, ChevronsUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CategoryAndPopulatedItemsResponse } from '@/types/category-types';
import { useEffect, useRef, useState } from 'react';

import { useListCategoryQuery } from '@/hooks/queries/categoryQuery';
import { useNavigate } from '@tanstack/react-router';
import { DropdownMenuSeparator } from '../ui/dropdown-menu';
import { Input } from '../ui/input';
import { SearchItemRequest } from '@/types/item-types';

interface CustomComboboxFilterProps {
  searchParams?: { category?: string };
}

const CustomComboboxFilter = ({ searchParams }: CustomComboboxFilterProps) => {
  const [categoryQuery, setCategoryQuery] = useState(
    searchParams?.category ?? '',
  );
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    data: { data: categories },
  } = useListCategoryQuery();
  const navigate = useNavigate();

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filterCategory = (value: string) => {
    setCategoryQuery(value);
    navigate({
      search: (old) => ({
        ...old,
        category: value,
      }),
    });
  };

  const resetCategory = () => {
    setCategoryQuery('');
    navigate({
      search: (old: SearchItemRequest) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { category, ...withoutCategory } = old;
        return withoutCategory;
      },
    });
  };

  const handleSelect = (category: CategoryAndPopulatedItemsResponse) => {
    filterCategory(category.name);
    setSearchTerm('');
    setOpen(false);
  };

  return (
    <>
      <h2>Kategori</h2>
      <div className="relative" ref={dropdownRef}>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          onClick={() => {
            setOpen(!open);
            if (!open) {
              setTimeout(() => inputRef.current?.focus(), 0);
            }
          }}
        >
          {categoryQuery
            ? categories.find((category) => category.name === categoryQuery)
                ?.name
            : 'Pilih kategori'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
        {open && (
          <div className="absolute p-1 w-full z-10 bg-popover rounded-md shadow-md mt-1">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Cari barang..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full focus-visible:ring-transparent"
            />
            <DropdownMenuSeparator className="mt-2" />
            <ul className="max-h-60 overflow-auto py-1 space-y-1">
              {filteredCategories.length === 0 ? (
                <li className="px-2 py-1 text-sm">Tidak ada kategori</li>
              ) : (
                filteredCategories.map((category) => (
                  <li
                    key={category.id}
                    onClick={() => handleSelect(category)}
                    className={cn(
                      'px-2 py-1 text-sm cursor-pointer hover:bg-accent rounded-sm flex justify-between categories-center',
                      category.name === categoryQuery && 'bg-accent',
                    )}
                  >
                    {category.name}
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        category.name === categoryQuery
                          ? 'opacity-100'
                          : 'opacity-0',
                      )}
                    />
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
        <Button
          className="mt-2"
          variant="outline"
          type="button"
          onClick={resetCategory}
        >
          Reset
        </Button>
      </div>
    </>
  );
};

export default CustomComboboxFilter;
