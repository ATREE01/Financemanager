import clsx from "clsx";

const SummaryCard = ({
  title,
  value,
  percentage,
  isPercentage = false,
  className,
}: {
  title: string;
  value: number | string;
  percentage?: number;
  isPercentage?: boolean;
  className?: string;
}) => {
  const percentageColor =
    percentage && percentage > 0
      ? "text-red-500"
      : percentage && percentage < 0
        ? "text-green-500"
        : "text-gray-500";

  return (
    <div
      className={clsx(
        "bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-xl hover:border-blue-500 transition-all duration-300 text-black",
        className,
      )}
    >
      <h3 className="text-lg font-medium text-gray-500">{title}</h3>
      <div className="flex items-baseline mt-2">
        <p className={`text-3xl font-bold ${isPercentage ? "font-mono" : ""}`}>
          {isPercentage ? value : `${Number(value).toLocaleString()}`}
        </p>
        {percentage !== undefined && (
          <span className={`text-lg font-semibold ml-2 ${percentageColor}`}>
            ({percentage.toFixed(2)}%)
          </span>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;
