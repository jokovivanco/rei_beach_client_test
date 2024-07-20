import { Check, ChevronsUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useListItemQuery } from '@/hooks/queries/itemQuery';
import { cn } from '@/lib/utils';
import { ItemAndPopulatedCategoryResponse } from '@/types/item-types';
import { InboundValidation } from '@/validators/inbound-validation';
import { useEffect, useRef, useState } from 'react';
import { ControllerRenderProps, useForm } from 'react-hook-form';
import { z } from 'zod';
import { FormControl } from '../ui/form';
import { Input } from '../ui/input';
import { DropdownMenuSeparator } from '../ui/dropdown-menu';

interface CustomComboboxProps {
  field: ControllerRenderProps<Record<string, string>, 'itemId'>;
  form: ReturnType<typeof useForm<z.infer<typeof InboundValidation.CREATE>>>;
  disabled?: boolean;
}

const CustomCombobox = ({
  field,
  form,
  disabled = false,
}: CustomComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    data: { data: items },
  } = useListItemQuery();

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
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

  const handleSelect = (item: ItemAndPopulatedCategoryResponse) => {
    form.setValue('itemId', item.id.toString());
    setSearchTerm('');
    setOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <FormControl>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-full justify-between ${disabled && 'opacity-50 hover:bg-transparent cursor-not-allowed'}`}
          onClick={() => {
            setOpen(!open);
            if (!open) {
              setTimeout(() => inputRef.current?.focus(), 0);
            }
          }}
        >
          <span className="truncate">
            {field.value
              ? items.find((item) => item.id.toString() === field.value)?.name
              : 'Pilih barang'}
          </span>
          {!disabled && (
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </FormControl>
      {open && !disabled && (
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
            {filteredItems.length === 0 ? (
              <li className="px-2 py-1 text-sm">Barang tidak ditemukan.</li>
            ) : (
              filteredItems.map((item) => (
                <li
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className={cn(
                    'px-2 py-1 text-sm cursor-pointer hover:bg-accent rounded-sm flex justify-between items-center',
                    item.id.toString() === field.value && 'bg-accent',
                  )}
                >
                  <span className="line-clamp-1" title={item.name}>
                    {item.name}
                  </span>
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      item.id.toString() === field.value
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
    </div>
  );
};

export default CustomCombobox;
