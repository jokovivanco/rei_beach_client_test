import {
  RegisteredRouter,
  RouteIds,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface CategorySelectSizeProps {
  from: RouteIds<RegisteredRouter['routeTree']>;
}

const SelectSize = <T extends { size?: number }>({
  from,
}: CategorySelectSizeProps) => {
  const searchParams = useSearch({ from }) as T;
  const { size } = searchParams;
  const navigate = useNavigate();

  function filterSize(value: string) {
    navigate({
      search: (old) => ({
        ...old,
        size: Number(value),
      }),
    });
  }

  return (
    <div className="flex gap-2 items-center">
      <p>Show</p>
      <Select
        defaultValue={size ? size.toString() : '10'}
        onValueChange={filterSize}
      >
        <SelectTrigger className="w-fit">
          <SelectValue placeholder="10" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <p>Entries</p>
    </div>
  );
};
export default SelectSize;
