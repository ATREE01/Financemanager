export default function DetailTable({
  titles,
  titleColor = "bg-blue-500",
  tableContent,
}: {
  titles: string[];
  titleColor?: string;
  tableContent: React.ReactNode[] | React.ReactNode | null;
}) {
  return (
    <table className="container mx-auto p-4 min-w-full bg-white text-black shadow-md rounded-lg overflow-hidden">
      <thead className="bg-white">
        <tr className="whitespace-nowrap">
          {titles.map((title, index) => (
            <th
              key={`${title}-${index}`}
              className={`py-3 px-4 ${titleColor} text-white text-center text-sm font-medium`}
            >
              {title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{tableContent}</tbody>
    </table>
  );
}
