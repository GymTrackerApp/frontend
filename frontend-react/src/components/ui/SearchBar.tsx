import { FaSearch } from "react-icons/fa";

interface SearchBarProps {
  value: string;
  setSearchQuery: (value: string) => void;
}

const SearchBar = ({ value, setSearchQuery }: SearchBarProps) => {
  return (
    <div className="relative w-full mb-2">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <FaSearch className="text-gray-400" size={16} />
      </div>
      <input
        type="text"
        className="w-full bg-gray-800 pl-10 px-2 py-1 rounded-md hover:outline-none focus:outline-none"
        placeholder="Search..."
        onChange={(e) => setSearchQuery(e.target.value)}
        value={value}
      />
    </div>
  );
};

export default SearchBar;
