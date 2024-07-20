interface DataCountCardProps {
  className: string;
  iconElement: JSX.Element;
  title: string;
  count: number;
}

const DataCountCard = ({
  className,
  iconElement,
  title,
  count,
}: DataCountCardProps) => {
  return (
    <div
      className={`${className} text-white rounded-lg p-2 flex justify-center items-center`}
    >
      <div className="flex justify-center items-center gap-3">
        {iconElement}
        <div>
          <p>{title}</p>
          <p className="font-medium">{count}</p>
        </div>
      </div>
    </div>
  );
};
export default DataCountCard;
