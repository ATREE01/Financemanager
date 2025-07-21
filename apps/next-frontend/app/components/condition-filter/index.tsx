import { Options } from "@financemanager/financemanager-website-types";
import clsx from "clsx";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export default function ConditionFilter({
  options,
  setFilter,
  className,
}: {
  options: Options[];
  setFilter: Dispatch<SetStateAction<string>>;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options?.[0] || null); // Initialize with the first option or null
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update selectedOption when options change
  useMemo(() => {
    if (options?.[0] && !selectedOption) {
      setSelectedOption(options[0]);
    }
  }, [options, selectedOption]);

  const handleSelect = (item: Options) => {
    setSelectedOption(item);
    setFilter(item.value);
    setIsOpen(false);
  };

  // Don't render if no options or selectedOption
  if (!options?.length || !selectedOption) {
    return null;
  }

  return (
    <div
      ref={dropdownRef} // Attach ref here
      className={clsx(
        "relative bg-white rounded-xl shadow-sm p-0 border border-gray-200", // p-0 because inner elements will provide padding
        "hover:shadow-xl hover:border-indigo-500 transition-all duration-300",
        "min-w-36",
        className,
      )}
    >
      {/* Custom Trigger Button */}
      <button
        className="block w-full py-2 pl-3 pr-10 text-lg text-center font-semibold text-gray-700 bg-gray-100 border border-transparent rounded-lg cursor-pointer
           focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-colors duration-200 whitespace-nowrap"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {selectedOption.name}
        {/* Custom arrow for select dropdown */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500">
          <svg
            className="fill-current h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.071 6.9l-1.414 1.414L9.293 12.95z" />
          </svg>
        </div>
      </button>

      {/* Custom Dropdown List */}
      {isOpen && (
        <ul
          className="absolute top-full mt-2 left-0 w-full bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-20"
          role="listbox"
        >
          {options.map((item, index) => (
            <li
              key={index}
              className={clsx(
                "py-2 px-3 text-lg text-gray-900 cursor-pointer",
                "hover:bg-indigo-100 hover:text-indigo-700 transition-colors duration-150",
                item.value === selectedOption.value &&
                  "bg-indigo-50 text-indigo-700 font-bold", // Highlight active selection
              )}
              onClick={() => handleSelect(item)}
              role="option"
              aria-selected={item.value === selectedOption.value}
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}

      {/* Hidden native select for accessibility and form submission (optional but recommended) */}
      <select
        className="sr-only"
        value={selectedOption.value}
        onChange={(e) => setFilter(e.target.value)}
        tabIndex={-1}
        aria-hidden="true"
      >
        {options.map((item, index) => (
          <option key={index} value={item.value}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  );
}
