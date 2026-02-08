import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import AbsoluteWindowWrapper from "./AbsoluteWindowWrapper";
import SearchBar from "./SearchBar";

interface SelectOptionWindowProps<T> {
  title: string;
  emptyDataMessage?: string;
  onClose: () => void;
  data: readonly T[];
  dataFilter?: (data: readonly T[], keyword: string) => T[];
  isDataLoading?: boolean;
  onSelect: (item: T) => void;
  renderItem: (data: T) => React.ReactNode;
}

const SelectOptionWindow = <T,>({
  title,
  emptyDataMessage,
  onClose,
  data,
  dataFilter,
  isDataLoading,
  onSelect,
  renderItem,
}: SelectOptionWindowProps<T>) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredData = dataFilter ? dataFilter(data, searchQuery) : data;

  return (
    <AbsoluteWindowWrapper isOpen={true} onClose={onClose}>
      <div className="px-6 pt-6 pb-3 flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        <button
          className="p-2 hover:bg-input-light hover:dark:bg-card-dark rounded-full transition-colors group cursor-pointer"
          onClick={onClose}
        >
          <FaTimes className="text-slate-400 text-xl" />
        </button>
      </div>
      <div className="px-6 pb-4">
        {dataFilter && (
          <SearchBar setSearchQuery={setSearchQuery} value={searchQuery} />
        )}
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-none p-6 pt-2">
        <div className="grid grid-cols-1 gap-3">
          {isDataLoading ? (
            <div className="flex items-center justify-between p-4 bg-input-light dark:bg-slate-800/40 rounded-xl border border-input-light dark:border-slate-700/30 text-left font-semibold">
              <p>Loading data...</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="flex items-center justify-between p-4 bg-input-light dark:bg-slate-800/40 rounded-xl border border-input-light dark:border-slate-700/30 text-left font-semibold">
              <p>
                {emptyDataMessage ||
                  (dataFilter ? "No matches found" : "No options available")}
              </p>
            </div>
          ) : (
            <>
              {filteredData.map((item, index) => (
                <button
                  key={index}
                  onClick={() => onSelect(item)}
                  className="group flex items-center justify-between p-4 bg-input-light/50 dark:bg-slate-800/40 rounded-xl border border-input-light dark:border-slate-700/30 hover:bg-input-light/80 hover:dark:bg-slate-800/80 transition-all text-left cursor-pointer"
                >
                  {renderItem(item)}
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </AbsoluteWindowWrapper>
  );
};

export default SelectOptionWindow;
