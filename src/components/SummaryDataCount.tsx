import { Users, Tags, Package } from 'lucide-react';
import DataCountCard from './DataCountCard';
import { useSummaryDataCountQuery } from '@/hooks/queries/generalQuery';

const SummaryDataCount = () => {
  const { data } = useSummaryDataCountQuery();
  return (
    <div className="flex justify-between items-center gap-8 flex-wrap">
      <DataCountCard
        className="bg-blue-500 grow min-w-52"
        iconElement={<Users size={32} />}
        title="Data User"
        count={data.data.user}
      />
      <DataCountCard
        className="bg-[#2D9CDB] grow min-w-52"
        iconElement={<Tags size={32} />}
        title="Data Kategori"
        count={data.data.category}
      />
      <DataCountCard
        className="bg-[#6FCF97] grow min-w-52"
        iconElement={<Package size={32} />}
        title="Data Barang"
        count={data.data.item }
      />
    </div>
  );
};
export default SummaryDataCount;
