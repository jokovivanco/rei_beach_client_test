import {
  categorySocket,
  inboundSocket,
  itemSocket,
  outboundSocket,
} from '@/apis/sockets';
import SummaryDataChart from '@/components/SummaryDataChart';
import SummaryDataCount from '@/components/SummaryDataCount';
import {
  countUserCategoryAndItemQueryOption,
  listInboundQueryOption,
  listOutboundQueryOption,
} from '@/lib/query/queryOptions';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';

export const Route = createFileRoute('/_authenticated/dashboard')({
  loader: async ({ context: { queryClient } }) => {
    return await Promise.all([
      queryClient.ensureQueryData(countUserCategoryAndItemQueryOption()),
      queryClient.ensureQueryData(listInboundQueryOption()),
      queryClient.ensureQueryData(listOutboundQueryOption()),
    ]);
  },
  component: Dashboard,
});

function Dashboard() {
  const queryClient = useQueryClient();

  useEffect(() => {
    function onChange() {
      queryClient.invalidateQueries({ queryKey: ['general', 'count'] });
    }

    function onInboundChange() {
      queryClient.invalidateQueries({ queryKey: ['inbound'] });
    }

    function onOutboundChange() {
      queryClient.invalidateQueries({ queryKey: ['outbound'] });
    }

    itemSocket.connect();
    categorySocket.connect();
    inboundSocket.connect();
    outboundSocket.connect();
    itemSocket.on('changes', onChange);
    categorySocket.on('changes', onChange);
    inboundSocket.on('changes', onInboundChange);
    outboundSocket.on('changes', onOutboundChange);

    return () => {
      itemSocket.disconnect();
      categorySocket.disconnect();
      inboundSocket.disconnect();
      outboundSocket.disconnect();
      itemSocket.off('changes', onChange);
      categorySocket.off('changes', onChange);
      inboundSocket.off('changes', onInboundChange);
      outboundSocket.off('changes', onOutboundChange);
    };
  }, [queryClient]);
  return (
    <div className="flex flex-col gap-4">
      <SummaryDataCount />
      <SummaryDataChart />
    </div>
  );
}
