import { FaTimes } from "react-icons/fa";
import AbsoluteWindowWrapper from "./AbsoluteWindowWrapper";

interface SelectOptionWindowProps<T> {
  title: string;
  onClose: () => void;
  data: T[];
  onSelect: (item: T) => void;
  renderItem: (data: T) => React.ReactNode;
}

const SelectOptionWindow = <T,>({
  title,
  onClose,
  data,
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
      <div
        className="max-h-[30vh] overflow-y-auto w-full scrollbar-thin scrollbar-track-gray-600 scrollbar-thumb-gray-500"
        defaultValue="default"
      >
        {data.map((item, index) => (
          <div
            key={index}
            onClick={() => onSelect(item)}
            className="bg-gray-700 cursor-pointer hover:opacity-80 my-1 px-2 py-1 rounded-md"
          >
            {renderItem(item)}
          </div>
        ))}
      </div>
    </AbsoluteWindowWrapper>
  );
};

export default SelectOptionWindow;
