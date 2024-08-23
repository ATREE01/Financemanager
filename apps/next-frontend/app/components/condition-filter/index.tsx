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
      <div className="h-full text-black font-bold flex-1 flex justify-center items-center ">
        <select
          className="h-4/5 w-[88%] rounded-full border-[1px] border-slate-300 bg-primary-100 text-center"
          onChange={(e) => {
            setFilter(e.target.value);
          }}
        >
          {options.map((item, index) => (
            <option className="filter-option" key={index} value={item.value}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
