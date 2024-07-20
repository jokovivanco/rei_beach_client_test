import { ReactChildren } from '@/types';

const TableContainer = ({ children }: ReactChildren) => {
  return (
    <div className="w-full p-4 rounded-lg shadow-sm bg-card">{children}</div>
  );
};
export default TableContainer;
