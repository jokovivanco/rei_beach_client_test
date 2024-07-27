import { cn } from '@/lib/utils';

const ContentContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn('p-6', className)}
      style={{
        height: '-webkit-calc(100vh - 3.5rem)',
      }}
    >
      {children}
    </div>
  );
};
export default ContentContainer;
