import { RegisteredRouter, RouteIds, useSearch } from '@tanstack/react-router';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Filter } from 'lucide-react';
import CustomComboboxFilter from './custom-ui/CustomComboboxFilter';
import { Button } from './ui/button';

interface FiltersProps {
  from: RouteIds<RegisteredRouter['routeTree']>;
}

const Filters = <T extends { category?: string }>({ from }: FiltersProps) => {
  const searchParams = useSearch({ from }) as T;
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="bg-primary p-2">
          <Filter />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter</SheetTitle>
          <SheetDescription aria-describedby={undefined}></SheetDescription>
          <CustomComboboxFilter searchParams={searchParams} />
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
export default Filters;
