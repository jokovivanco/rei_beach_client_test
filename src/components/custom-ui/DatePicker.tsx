import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { ControllerRenderProps } from 'react-hook-form';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { FormControl } from '../ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
interface DatePickerProps {
  field: ControllerRenderProps<Record<string, string>, 'issued_at'>;
}

const DatePicker = ({ field }: DatePickerProps) => {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant={'outline'}
            className={cn(
              'w-full pl-3 text-left font-normal',
              !field.value && 'text-muted-foreground',
            )}
          >
            {field.value ? (
              format(field.value, 'PPP', { locale: id })
            ) : (
              <span>Pick a date</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          className="pointer-events-auto"
          mode="single"
          selected={new Date(field.value)}
          onSelect={(e) => {
            field.onChange(e);
            setOpen(false);
          }}
          disabled={(date: Date) =>
            date > new Date() || date < new Date('1900-01-01')
          }
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};
export default DatePicker;
