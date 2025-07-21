const SummaryCard = ({
  title,
  value,
  isPercentage = false,
}: {
  title: string;
  value: number | string;
  isPercentage?: boolean;
}) => (
  <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-xl hover:border-blue-500 transition-all duration-300">
    <h3 className="text-lg font-medium text-gray-500">{title}</h3>
    <p
      className={`text-3xl font-bold text-gray-900 mt-2 ${
        isPercentage ? "font-mono" : ""
      }`}
    >
      {isPercentage ? value : `$${Number(value).toLocaleString()}`}
    </p>
  </div>
);

export default SummaryCard;
