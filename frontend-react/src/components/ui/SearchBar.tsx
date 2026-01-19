import { FaSearch } from "react-icons/fa";

interface SearchBarProps {
  value: string;
  setSearchQuery: (value: string) => void;
}

const SearchBar = ({ value, setSearchQuery }: SearchBarProps) => {
  return (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-500 group-focus-within:text-primary transition-colors">
        <FaSearch className="text-xl" size={16} />
      </div>
      <input
        type="text"
        aria-label="Search"
        className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl py-3 pl-11 pr-4 text-white text-sm focus:ring-1 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all placeholder:text-slate-500"
        placeholder="Search..."
        onChange={(e) => setSearchQuery(e.target.value)}
        value={value}
      />
    </div>
  );
};

export default SearchBar;
