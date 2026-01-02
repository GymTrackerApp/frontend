import { FaTimes } from "react-icons/fa";
import AbsoluteWindowWrapper from "./AbsoluteWindowWrapper";

interface SelectOptionWindowProps<T> {
  title: string;
  emptyDataMessage?: string;
  onClose: () => void;
  data: T[];
  isDataLoading?: boolean;
  onSelect: (item: T) => void;
  renderItem: (data: T) => React.ReactNode;
}

const SelectOptionWindow = <T,>({
  title,
  emptyDataMessage,
  onClose,
  data,
  isDataLoading,
  onSelect,
  renderItem,
}: SelectOptionWindowProps<T>) => {
  return (
    <AbsoluteWindowWrapper isOpen={true} onClose={onClose}>
      <header className="flex justify-between items-center px-1 w-full">
        <p className="text-xl font-bold">{title}</p>
        <span>
          <FaTimes onClick={onClose} className="cursor-pointer" />
        </span>
      </header>
      <div className="max-h-[30vh] overflow-y-auto w-full scrollbar-thin scrollbar-track-gray-600 scrollbar-thumb-gray-500">
        {isDataLoading ? (
          <div className="bg-components-main my-1 px-2 py-1 rounded-md">
            <p>Loading data...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="bg-gray-700 my-1 px-2 py-1 rounded-md">
            {emptyDataMessage || "No options available"}
          </div>
        ) : (
          data.map((item, index) => (
            <div
              key={index}
              onClick={() => onSelect(item)}
              className="bg-gray-700 cursor-pointer hover:opacity-80 my-1 px-2 py-1 rounded-md"
            >
              {renderItem(item)}
            </div>
          ))
        )}
      </div>
    </AbsoluteWindowWrapper>
  );
};

export default SelectOptionWindow;
