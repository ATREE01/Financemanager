import clsx from "clsx";

const SummaryCard = ({
  title,
  value,
  isPercentage = false,
  className,
}: {
  title: string;
  value: number | string;
  isPercentage?: boolean;
  className?: string;
}) => (
  <div
    className={clsx(
      "bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-xl hover:border-blue-500 transition-all duration-300 text-black",
      className,
    )}
  >
    <h3 className="text-lg font-medium text-gray-500">{title}</h3>
    <p className={`text-3xl font-bold mt-2 ${isPercentage ? "font-mono" : ""}`}>
      {isPercentage ? value : `$${Number(value).toLocaleString()}`}
    </p>
  </div>
);

export default SummaryCard;
