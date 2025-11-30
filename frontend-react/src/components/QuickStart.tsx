import { FaPlay, FaRegCalendar } from "react-icons/fa";

const QuickStart = () => {
  return (
    <div className="w-full bg-gray-700 px-2 py-2 pb-10 mt-3">
      <h1 className="text-2xl font-semibold">Quick Start</h1>
      <button className="bg-blue-500 w-1/3 flex justify-center py-2 rounded-xl mx-auto cursor-pointer hover:bg-blue-400 transition-colors">
        <span aria-hidden="true" className="flex items-center mr-2">
          <FaPlay />
        </span>
        <span>Start Ad Hoc Workout</span>
      </button>
      <button className="bg-gray-500 w-1/3 flex justify-center py-2 rounded-xl mx-auto mt-5 cursor-pointer hover:bg-gray-400 transition-colors">
        <span aria-hidden="true" className="flex items-center mr-2">
          <FaRegCalendar />
        </span>
        <span>Start Planned Workout</span>
      </button>
    </div>
  );
};

export default QuickStart;
