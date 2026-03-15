import React, { Dispatch, SetStateAction, useState } from "react";
import { DateRange } from "react-day-picker";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// 分別定義 startDate 與 endDate 的型別，解決 null 造成的衝突
interface StartDateState {
  data: Date | null;
  setData: Dispatch<SetStateAction<Date | null>>;
}

interface EndDateState {
  data: Date;
  setData: Dispatch<SetStateAction<Date>>;
}

interface DateOption {
  id: string;
  label: string;
  getDates: () => { start: Date | null; end: Date };
}

export default function DurationFilter({
  startDate,
  endDate,
}: {
  startDate: StartDateState;
  endDate: EndDateState;
}) {
  const dateOptions: DateOption[] = [
    {
      id: "default",
      label: "不限",
      getDates: () => ({
        start: null,
        end: new Date(),
      }),
    },
    {
      id: "week",
      label: "近一周",
      getDates: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 7);
        return { start, end };
      },
    },
    {
      id: "month",
      label: "近一個月",
      getDates: () => {
        const end = new Date();
        const start = new Date();
        start.setMonth(end.getMonth() - 1);
        return { start, end };
      },
    },
    {
      id: "3months",
      label: "近三個月",
      getDates: () => {
        const end = new Date();
        const start = new Date();
        start.setMonth(end.getMonth() - 3);
        return { start, end };
      },
    },
    {
      id: "ytd",
      label: "今年至今",
      getDates: () => ({
        start: new Date(new Date().getFullYear(), 0, 1),
        end: new Date(),
      }),
    },
  ];

  const [activeButton, setActiveButton] = useState("default");
  const [showCustomPicker, setShowCustomPicker] = useState(false);

  // 用於 Calendar 內部暫存的選取範圍，將 null 轉為 undefined 以符合 react-day-picker 的型別要求
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startDate.data || undefined,
    to: endDate.data,
  });

  // 判斷是否為不限時間
  const isUnlimited = startDate.data === null;

  const baseClasses =
    "w-28 px-4 py-2 rounded-lg font-semibold transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";
  const inactiveClasses = "bg-gray-200 text-gray-700 hover:bg-gray-300";
  const activeClasses = "bg-indigo-600 text-white shadow-md";

  const handleDurationClick = (option: DateOption) => {
    const { start, end } = option.getDates();
    startDate.setData(start);
    endDate.setData(end);
    setActiveButton(option.id);
    setShowCustomPicker(false);
    // 同步更新自訂選取器的 state，將 null 轉回 undefined
    setDateRange({ from: start || undefined, to: end });
  };

  const handleCustomDateApply = () => {
    if (dateRange?.from && dateRange?.to) {
      startDate.setData(dateRange.from);
      endDate.setData(dateRange.to);
      setActiveButton("customize");
      setShowCustomPicker(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-3 justify-center z-10 text-black text-md">
        {dateOptions.map((option) => (
          <button
            key={option.id}
            className={`${baseClasses} ${
              activeButton === option.id ? activeClasses : inactiveClasses
            }`}
            onClick={() => handleDurationClick(option)}
          >
            {option.label}
          </button>
        ))}

        <div className="relative">
          <Popover open={showCustomPicker} onOpenChange={setShowCustomPicker}>
            <PopoverTrigger asChild>
              <button
                className={`${baseClasses} ${
                  activeButton === "customize" ? activeClasses : inactiveClasses
                }`}
                onClick={() => setActiveButton("customize")}
              >
                自訂
              </button>
            </PopoverTrigger>

            <PopoverContent
              className="w-auto p-0 rounded-2xl shadow-2xl border-gray-100 overflow-hidden"
              align="center"
              sideOffset={8}
            >
              <Calendar
                className="p-6"
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                pagedNavigation
                /**
                 * 若目前是「不限 (null)」狀態，則月曆預設顯示今天。
                 */
                defaultMonth={startDate.data || new Date()}
              />

              {/* 美化底部的操作區塊 */}
              <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                <div className="text-sm text-gray-500 font-medium">
                  {dateRange?.from ? (
                    <>
                      {dateRange.from.toLocaleDateString()} -{" "}
                      {dateRange.to
                        ? dateRange.to.toLocaleDateString()
                        : "選擇結束日期"}
                    </>
                  ) : (
                    "請選擇日期範圍"
                  )}
                </div>
                <button
                  className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-semibold tracking-wide transition-all duration-200 hover:bg-indigo-700 hover:shadow-md active:scale-[0.96] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
                  onClick={handleCustomDateApply}
                  disabled={!dateRange?.from || !dateRange?.to}
                >
                  套用
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="text-gray-600 text-sm my-2 text-center">
        當前期間:{" "}
        <span className="font-semibold">
          {isUnlimited ? "不限" : startDate.data?.toLocaleDateString()}
        </span>{" "}
        ~{" "}
        <span className="font-semibold">
          {endDate.data.toLocaleDateString()}
        </span>
      </div>
    </>
  );
}
