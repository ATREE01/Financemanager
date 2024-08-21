import styles from "./index.module.css";

export default function DetailTable({
  titles,
  tableContent,
}: {
  titles: string[];
  tableContent: JSX.Element[] | null;
}) {
  return (
    <div className="h-[65vh] w-[90vw] overflow-auto text-black">
      <table className="w-full">
        <thead>
          <tr className="w-full bg-primary-200 overflow-auto">
            {titles.map((item, index) => (
              <th className={styles["table-data-cell"]} key={index}>
                {item}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{tableContent}</tbody>
      </table>
    </div>
  );
}
