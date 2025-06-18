import { useState, useRef } from "react";
import { MinusIcon, PlusIcon } from "../common/icons";
import "./index.css";

type Unit = "%" | "px";

export default function CalculateUnit() {
  const [unit, setUnit] = useState<Unit>("%");
  const [value, setValue] = useState("1.0");
  const [lastValidValue, setLastValidValue] = useState("1.0");
  const [hoverInput, setHoverInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const getValidNumber = (input: string): number | null => {
    const cleaned = input.replace(/,/g, ".");

    // eslint-disable-next-line no-useless-escape
    if (!/^[0-9.\-]/.test(cleaned)) return null;

    // eslint-disable-next-line no-useless-escape
    const match = cleaned.match(/^\-?[0-9]*\.?[0-9]*/);
    if (!match || !match[0]) return null;

    const num = parseFloat(match[0]);
    if (isNaN(num)) return null;

    if (num < 0) return 0;
    if (unit === "%" && num > 100) return null;

    return num;
  };

  const handleBlurOrEnter = () => {
    const parsed = getValidNumber(value);
    if (parsed === null) {
      setValue(lastValidValue);
      return;
    }

    const newVal = parsed.toString();
    setValue(newVal);
    setLastValidValue(newVal);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleBlurOrEnter();
      inputRef.current?.blur();
    }
  };

  const increase = () => {
    const parsed = getValidNumber(value);
    const num = parsed === null ? parseFloat(lastValidValue) : parsed;
    const next = unit === "%" ? Math.min(100, num + 1) : num + 1;
    const str = next.toString();
    setValue(str);
    setLastValidValue(str);
  };

  const decrease = () => {
    const parsed = getValidNumber(value);
    const num = parsed === null ? parseFloat(lastValidValue) : parsed;
    const next = Math.max(0, num - 1);
    const str = next.toString();
    setValue(str);
    setLastValidValue(str);
  };

  const switchUnit = (next: Unit) => {
    let num = getValidNumber(value);
    if (num === null) num = parseFloat(lastValidValue);

    if (next === "%" && num > 100) num = 100;

    const str = num.toString();
    setValue(str);
    setLastValidValue(str);
    setUnit(next);
  };

  const currentVal = parseFloat(
    getValidNumber(value)?.toString() || lastValidValue
  );

  return (
    <div className="flex items-center justify-between flex-col">
      <div className="w-full flex justify-between items-center mb-4">
        <span className="text-[#AAAAAA]">Unit</span>
        <div className="flex bg-neutral-800 p-1 rounded-lg w-fit overflow-hidden h-[36px] w-[30%]">
          <button
            className={`px-7 py-2 text-sm rounded-md transition-colors duration-150 cursor-pointer w-1/2 flex items-center
              ${
                unit === "%"
                  ? "bg-neutral-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            onClick={() => switchUnit("%")}
          >
            %
          </button>
          <button
            className={`px-7 py-2 text-sm rounded-md transition-colors duration-150 cursor-pointer w-1/2 flex items-center
              ${
                unit === "px"
                  ? "bg-neutral-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            onClick={() => switchUnit("px")}
          >
            px
          </button>
        </div>
      </div>

      <div className="w-full flex justify-between items-center">
        <span className="text-[#AAAAAA]">Value</span>
        <div className="flex items-center justify-center min-h-[36px]">
          <div
            className={`
              flex items-center rounded-md h-[36px] transition-colors duration-150 outline-none
              focus-within:ring-[1px] focus-within:ring-blue-500
              ${hoverInput ? "bg-neutral-600" : "bg-neutral-800"}
            `}
          >
            <div className="relative group">
              {+value <= 0 && (
                <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs text-white bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                  Value must greater than 0
                </div>
              )}
              <button
                onClick={decrease}
                disabled={+currentVal <= 0}
                className="flex justify-center items-center font-bold leading-none h-[36px] w-[36px] rounded-l-md transition-colors duration-150 hover:bg-neutral-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MinusIcon width={12} height={24} />
              </button>
            </div>

            <input
              name="unit-value"
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onMouseEnter={() => setHoverInput(true)}
              onMouseLeave={() => setHoverInput(false)}
              onKeyDown={handleKeyDown}
              onBlur={handleBlurOrEnter}
              className="w-[74px] text-center bg-transparent outline-none text-white transition-colors duration-150"
            />
            <div className="relative group">
              {unit === "%" && +value >= 100 && (
                <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs text-white bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                  Value must smaller than 100
                </div>
              )}
              <button
                onClick={increase}
                disabled={unit === "%" && +value >= 100}
                className="flex justify-center items-center font-bold leading-none h-[36px] w-[36px] rounded-r-md transition-colors duration-150 hover:bg-neutral-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PlusIcon width={12} height={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
