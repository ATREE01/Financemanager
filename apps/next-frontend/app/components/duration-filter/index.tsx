import React, { Dispatch, SetStateAction, useState } from "react";

// Interface for the date state props
interface DateState {
  data: Date;
  setData: Dispatch<SetStateAction<Date>>;
}
interface DateOption {
  id: string;
  label: string;
  getDates: () => { start: Date; end: Date };
}

/**
 * A component providing buttons to filter by a date duration.
 * @param {object} props - The component props.
 * @param {DateState} props.startDate - State object for the start date.
 * @param {DateState} props.endDate - State object for the end date.
 */
export default function DurationFilter({
  startDate,
  endDate,
}: {
  startDate: DateState;
  endDate: DateState;
}) {
  const dateOptions: DateOption[] = [
    {
      id: "default",
      label: "不限", // "Unlimited"
      getDates: () => ({
        start: new Date("1900-01-01"),
        end: new Date(),
      }),
    },
    {
      id: "week",
      label: "近一周", // "Past Week"
      getDates: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 7);
        return { start, end };
      },
    },
    {
      id: "month",
      label: "近一個月", // "Past Month"
      getDates: () => {
        const end = new Date();
        const start = new Date();
        start.setMonth(end.getMonth() - 1);
        return { start, end };
      },
    },
    {
      id: "3months",
      label: "近三個月", // "Past 3 Months"
      getDates: () => {
        const end = new Date();
        const start = new Date();
        start.setMonth(end.getMonth() - 3);
        return { start, end };
      },
    },
    {
      id: "ytd",
      label: "今年至今", // "Year to Date"
      getDates: () => ({
        start: new Date(new Date().getFullYear(), 0, 1),
        end: new Date(),
      }),
    },
  ];

  // State to track the active button's key. Default is now empty so no button is active on load.
  const [activeButton, setActiveButton] = useState("default");
  // State to control the visibility of the custom date picker popover
  const [showCustomPicker, setShowCustomPicker] = useState(false);

  // State for the custom date inputs
  const today = new Date().toISOString().split("T")[0];
  const [customStart, setCustomStart] = useState(today);
  const [customEnd, setCustomEnd] = useState(today);

  // Configuration for the duration buttons

  // Common Tailwind classes for buttons
  const baseClasses =
    "w-28 px-4 py-2 rounded-lg font-semibold transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";
  const inactiveClasses = "bg-gray-200 text-gray-700 hover:bg-gray-300";
  const activeClasses = "bg-indigo-600 text-white shadow-md";

  // Handler for standard duration button clicks
  const handleDurationClick = (option: DateOption) => {
    const { start, end } = option.getDates();
    startDate.setData(start);
    endDate.setData(end);
    setActiveButton(option.id);
    setShowCustomPicker(false); // Close picker if it was open
  };

  // Handler for the "Confirm" button in the custom date picker
  const handleCustomDateApply = () => {
    if (
      customStart &&
      customEnd &&
      new Date(customStart) <= new Date(customEnd)
    ) {
      startDate.setData(new Date(customStart));
      endDate.setData(new Date(customEnd));
      setActiveButton("customize");
      setShowCustomPicker(false);
    } else {
      // Here you could show an error message to the user
      console.error("Invalid custom date range");
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-3 justify-center z-10 text-black text-md">
        {/* Map over the options array to render buttons */}
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

        {/* Custom Date Range Button and Popover */}
        <div className="relative">
          <button
            className={`${baseClasses} ${
              activeButton === "customize" ? activeClasses : inactiveClasses
            }`}
            onClick={() => {
              setActiveButton("customize");
              setShowCustomPicker(!showCustomPicker);
            }}
          >
            自訂 {/* "Custom" */}
          </button>

          {showCustomPicker && (
            <div
              className="absolute top-full mt-2 bg-white p-4 rounded-lg shadow-xl w-72 z-20 border border-gray-200"
              // Stop propagation to prevent the button's onClick from re-triggering
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="start-date"
                    className="text-gray-600 font-medium"
                  >
                    起:
                  </label>
                  <input
                    type="date"
                    id="start-date"
                    className="ml-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 w-48"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="end-date"
                    className="text-gray-600 font-medium"
                  >
                    迄:
                  </label>
                  <input
                    type="date"
                    id="end-date"
                    className="ml-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 w-48"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                  />
                </div>
              </div>
              <button
                className="w-full mt-4 bg-indigo-500 text-white p-2 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={handleCustomDateApply}
              >
                確定 {/* "Confirm" */}
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Displaying the current duration */}
      <div className="text-gray-600 text-sm my-2 text-center">
        當前期間:{" "}
        <span className="font-semibold">
          {startDate.data.toLocaleDateString()}
        </span>{" "}
        ~{" "}
        <span className="font-semibold">
          {endDate.data.toLocaleDateString()}
        </span>
      </div>
    </>
  );
}
