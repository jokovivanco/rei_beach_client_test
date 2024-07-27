import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

const TableContainer = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div className={cn('w-full p-4 rounded-lg shadow-sm bg-card', className)}>
      {children}
    </div>
  );
};

export default TableContainer;
