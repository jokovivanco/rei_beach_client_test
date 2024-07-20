import { useListInboundQuery } from '@/hooks/queries/inboundQuery';
import { useListOutboundQuery } from '@/hooks/queries/outboundQuery';
import { groupInOutBoundByMonth } from '@/lib/utils';
import {
  BarElement,
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { useMemo, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import TableContainer from './containers/TableContainer';
import SelectYear from './SelectYear';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const SummaryDataChart = () => {
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());

  const {
    data: { data: inbounds },
  } = useListInboundQuery();
  const {
    data: { data: outbounds },
  } = useListOutboundQuery();

  const groupedInbounds = useMemo(() => {
    const data = groupInOutBoundByMonth(inbounds, filterYear);
    return {
      data: data.map((inbound) => ({
        month: inbound.month,
        quantity: inbound.bounds.reduce((prev, acc) => prev + acc.quantity, 0),
      })),
      labels: data.map((inbound) => inbound.month),
    };
  }, [inbounds, filterYear]);
  const groupedOutbounds = useMemo(() => {
    const data = groupInOutBoundByMonth(outbounds, filterYear);
    return {
      labels: data.map((outbound) => outbound.month),
      data: data.map((outbound) => ({
        month: outbound.month,
        quantity: outbound.bounds.reduce((prev, acc) => prev + acc.quantity, 0),
      })),
    };
  }, [outbounds, filterYear]);

  const labelUsed =
    groupedInbounds.labels.length >= groupedOutbounds.labels.length
      ? groupedInbounds.labels
      : groupedOutbounds.labels;

  const data: ChartData<'bar'> = {
    labels: labelUsed,
    datasets: [
      {
        label: 'Barang Masuk',
        data: labelUsed.map((label) => {
          let result = 0;
          groupedInbounds.data.forEach((data) => {
            if (data.month === label) result = data.quantity;
          });
          return result;
        }),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Barang Keluar',
        data: labelUsed.map((label) => {
          let result = 0;
          groupedOutbounds.data.forEach((data) => {
            if (data.month === label) result = data.quantity;
          });
          return result;
        }),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Jumlah barang masuk dan keluar setiap bulan',
      },
    },
  };

  return (
    <TableContainer>
      <SelectYear value={filterYear} setFilterYear={setFilterYear} />
      <Bar className="!h-[680px]" options={options} data={data} />
    </TableContainer>
  );
};
export default SummaryDataChart;
