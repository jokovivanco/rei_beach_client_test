import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SelectYearProps {
  value: number;
  setFilterYear: (year: number) => void;
}

const SelectYear = ({ setFilterYear, value }: SelectYearProps) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - i);

  return (
    <Select
      onValueChange={(val) => setFilterYear(Number(val))}
      value={value.toString()}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Pilih tahun" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Tahun</SelectLabel>
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
export default SelectYear;
