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

  return (
    <AbsoluteWindowWrapper isOpen={true} onClose={onClose}>
      <div className="px-6 pt-6 pb-3 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
        <button
          className="p-2 hover:bg-surface-dark rounded-full transition-colors group cursor-pointer"
          onClick={onClose}
        >
          <FaTimes className="text-slate-400 group-hover:text-white text-xl" />
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
            <div className="flex items-center justify-between p-4 bg-slate-800/40 rounded-xl border border-slate-700/30 text-left font-semibold">
              <p>Loading data...</p>
            </div>
          ) : !data || data.length === 0 ? (
            <div className="flex items-center justify-between p-4 bg-slate-800/40 rounded-xl border border-slate-700/30 text-left font-semibold">
              <p>{emptyDataMessage || "No options available"}</p>
            </div>
          ) : (
            <>
              {(dataFilter ? dataFilter(data, searchQuery) : data).map(
                (item, index) => (
                  <button
                    key={index}
                    onClick={() => onSelect(item)}
                    className="group flex items-center justify-between p-4 bg-slate-800/40 rounded-xl border border-slate-700/30 hover:bg-slate-800/80 transition-all text-left cursor-pointer"
                  >
                    {renderItem(item)}
                  </button>
                )
              )}
            </>
          )}
        </div>
      </div>
    </AbsoluteWindowWrapper>
  );
};

export default SelectOptionWindow;
