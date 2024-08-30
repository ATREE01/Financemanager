export default function DetailTable({
  titles,
  tableContent,
}: {
  titles: string[];
  tableContent: JSX.Element[] | null;
}) {
  return (
    <div className="w-[90%] overflow-auto text-black">
      <div className="overflow-x-auto">
        <table className="container mx-auto p-4 min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="whitespace-nowrap">
              {titles.map((item) => (
                <th
                  key={item}
                  className="py-3 px-4 bg-blue-500 text-white text-center text-sm font-medium "
                >
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{tableContent}</tbody>
        </table>
      </div>
    </div>
  );
}
