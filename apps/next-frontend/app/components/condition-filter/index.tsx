import { Options } from "@financemanager/financemanager-webiste-types";
import { Dispatch, SetStateAction } from "react";

export default function ConditionFilter({
  options,
  setFilter,
}: {
  options: Options[];
  setFilter: Dispatch<SetStateAction<string>>;
}) {
  return (
    <>
      <select
        className="w-full py-2 text-black font-bold bg-blue-100 rounded-lg focus:ring-2 focus:primary-500 text-center"
        onChange={(e) => {
          setFilter(e.target.value);
        }}
      >
        {options.map((item, index) => (
          <option key={index} value={item.value}>
            {item.name}
          </option>
        ))}
      </select>
    </>
  );
}
