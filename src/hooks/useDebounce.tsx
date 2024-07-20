import { useEffect, useState } from 'react';

interface Props {
  value: string;
  delay: number;
}

export default function useDebounce({ value, delay }: Props) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
