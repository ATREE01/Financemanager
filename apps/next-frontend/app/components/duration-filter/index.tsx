import { Dispatch, SetStateAction, useState } from "react";

interface StringState {
  data: string;
  setData: Dispatch<SetStateAction<string>>;
}

export default async function DurationFilter({
  duration,
  startDate,
  endDate,
}: {
  duration: StringState;
  startDate: StringState;
  endDate: StringState;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-wrap justify-center z-10 text-black font-bold text-md">
      <div
        className={`w-24 h-8 rounded-xl m-2 px-2 flex items-center justify-center border-[1px] border-slate-300 bg-primary-100 cursor-pointer hover:brightness-75 ${duration.data === "default" ? "brightness-75" : ""}`}
        onClick={() => {
          duration.setData("default");
          setShow(false);
        }}
      >
        不限
      </div>
      <div
        className={`w-24 h-8 rounded-xl m-2 px-2 flex items-center justify-center border-[1px] border-slate-300 bg-primary-100 cursor-pointer hover:brightness-75 ${duration.data === "7" ? "brightness-75" : ""}`}
        onClick={() => {
          duration.setData("7");
          setShow(false);
        }}
      >
        近一周
      </div>
      <div
        className={`w-24 h-8 rounded-xl m-2 px-2 flex items-center justify-center border-[1px] border-slate-300 bg-primary-100 cursor-pointer hover:brightness-75 ${duration.data === "30" ? "brightness-75" : ""}`}
        onClick={() => {
          duration.setData("30");
          setShow(false);
        }}
      >
        近一個月
      </div>
      <div
        className={`w-24 h-8 rounded-xl m-2 px-2 flex items-center justify-center border-[1px] border-slate-300 bg-primary-100 cursor-pointer hover:brightness-75 ${duration.data === "90" ? "brightness-75" : ""}`}
        onClick={() => {
          duration.setData("90");
          setShow(false);
        }}
      >
        近三個月
      </div>
      <div
        className={`w-24 h-8 rounded-xl m-2 px-2 flex items-center justify-center border-[1px] border-slate-300 bg-primary-100 cursor-pointer hover:brightness-75 ${duration.data === "YTD" ? "brightness-75" : ""}`}
        onClick={() => {
          duration.setData("ytd");
          setShow(false);
        }}
      >
        今年至今
      </div>
      <div
        className={`w-24 h-8 rounded-xl m-2 px-2 flex items-center justify-center border-[1px] border-slate-300 bg-primary-100 relative cursor-pointer`}
        onClick={() => {
          duration.setData("customize");
          setShow(!show);
        }}
      >
        自訂
        {duration.data === "customize" && show && (
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
                value={startDate.data}
                onChange={(e) => startDate.setData(e.target.value)}
              />
            </div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-gray-600">迄:</label>
              <input
                type="date"
                id="end-date"
                className="ml-2 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={endDate.data}
                onChange={(e) => endDate.setData(e.target.value)}
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
