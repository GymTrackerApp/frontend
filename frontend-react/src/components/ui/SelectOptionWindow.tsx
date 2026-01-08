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
      <header className="flex justify-between items-center px-1 w-full mb-1">
        <p className="text-xl font-bold">{title}</p>
        <FaTimes
          onClick={onClose}
          className="cursor-pointer hover:opacity-80"
        />
      </header>
      <div className="max-h-[30vh] overflow-y-auto w-full scrollbar-none">
        {isDataLoading ? (
          <div className="bg-components-main my-1 px-2 py-1 rounded-md">
            <p>Loading data...</p>
          </div>
        ) : !data || data.length === 0 ? (
          <div className="bg-gray-700 my-1 px-2 py-1 rounded-md">
            {emptyDataMessage || "No options available"}
          </div>
        ) : (
          <>
            {dataFilter && (
              <SearchBar setSearchQuery={setSearchQuery} value={searchQuery} />
            )}
            {(dataFilter ? dataFilter(data, searchQuery) : data).map(
              (item, index) => (
                <div
                  key={index}
                  onClick={() => onSelect(item)}
                  className="bg-subcomponents-main cursor-pointer hover:bg-subcomponents-main-hover my-1 px-2 py-1 rounded-md"
                >
                  {renderItem(item)}
                </div>
              )
            )}
          </>
        )}
      </div>
    </AbsoluteWindowWrapper>
  );
};

export default SelectOptionWindow;
