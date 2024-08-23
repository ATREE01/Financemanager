import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface DateState {
  data: Date;
  setData: Dispatch<SetStateAction<Date>>;
}

export default function DurationFilter({
  startDate,
  endDate,
}: {
  startDate: DateState;
  endDate: DateState;
}) {
  const [show, setShow] = useState(false);
  const [duration, setDuration] = useState("default");

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  useEffect(() => {
    switch (duration) {
      case "week":
        startDate.data.setDate(new Date().getDate() - 7);
        break;
      case "month":
        startDate.data.setDate(new Date().getDate() - 30);
        break;
      case "3month":
        startDate.data.setDate(new Date().getDate() - 90);
        break;
      case "ytd":
        startDate.data.setDate(
          new Date(new Date().getFullYear(), 0, 1).getDate(),
        );
        break;
      case "customize":
        startDate.setData(new Date(start));
        endDate.setData(new Date(end));
        break;
      case "default":
        break;
    }
  }, [duration, start, end, startDate, endDate]);

  return (
    <div className="flex flex-wrap justify-center z-10 text-black font-bold text-md">
      <div
        className={`w-24 h-8 rounded-xl m-2 px-2 flex items-center justify-center border-[1px] border-slate-300 bg-primary-100 cursor-pointer hover:brightness-75 ${duration === "default" ? "brightness-75" : ""}`}
        onClick={() => {
          setDuration("default");
          setShow(false);
        }}
      >
        不限
      </div>
      <div
        className={`w-24 h-8 rounded-xl m-2 px-2 flex items-center justify-center border-[1px] border-slate-300 bg-primary-100 cursor-pointer hover:brightness-75 ${duration === "week" ? "brightness-75" : ""}`}
        onClick={() => {
          setDuration("week");
          setShow(false);
        }}
      >
        近一周
      </div>
      <div
        className={`w-24 h-8 rounded-xl m-2 px-2 flex items-center justify-center border-[1px] border-slate-300 bg-primary-100 cursor-pointer hover:brightness-75 ${duration === "month" ? "brightness-75" : ""}`}
        onClick={() => {
          setDuration("month");
          setShow(false);
        }}
      >
        近一個月
      </div>
      <div
        className={`w-24 h-8 rounded-xl m-2 px-2 flex items-center justify-center border-[1px] border-slate-300 bg-primary-100 cursor-pointer hover:brightness-75 ${duration === "3month" ? "brightness-75" : ""}`}
        onClick={() => {
          setDuration("3months");
          setShow(false);
        }}
      >
        近三個月
      </div>
      <div
        className={`w-24 h-8 rounded-xl m-2 px-2 flex items-center justify-center border-[1px] border-slate-300 bg-primary-100 cursor-pointer hover:brightness-75 ${duration === "ytd" ? "brightness-75" : ""}`}
        onClick={() => {
          setDuration("ytd");
          setShow(false);
        }}
      >
        今年至今
      </div>
      <div
        className={`w-24 h-8 rounded-xl m-2 px-2 flex items-center justify-center border-[1px] border-slate-300 bg-primary-100 relative cursor-pointer`}
        onClick={() => {
          setDuration("customize");
          setShow(!show);
        }}
      >
        自訂
        {duration === "customize" && show && (
          <div
            className="absolute top-10 bg-white p-4 rounded-lg shadow-lg w-64"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <label className="text-gray-600">起:</label>
              <input
                type="date"
                id="start-date"
                className="ml-2 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-gray-600">迄:</label>
              <input
                type="date"
                id="end-date"
                className="ml-2 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </div>
            <button
              className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={() => setShow(!show)}
            >
              確定
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
