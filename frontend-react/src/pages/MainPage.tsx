import { Link } from "react-router-dom";
import Header from "../components/Header";
import PlanBlock from "../components/PlanBlock";
import QuickStart from "../components/QuickStart";

const MainPage = () => {
  return (
    <>
      <Header />
      <div className="bg-gray-800 text-white flex flex-col items-center min-h-dvh pt-3">
        <h1 className="text-3xl font-bold">Welcome back, John!</h1>
        <p className="text-gray-400">Ready to crush your workout?</p>
        <QuickStart />
        <div className="w-full px-2 pt-3 bg-gray-700 mt-5 pb-8">
          <div className="flex justify-between">
            <h1 className="text-2xl font-semibold">My Plans</h1>
            <Link to="/plans">
              <button className="px-2 py-1 border-2 text-blue-500 border-blue-500 rounded-xl cursor-pointer hover:border-blue-400 hover:text-blue-400 transition-colors">
                View All
              </button>
            </Link>
          </div>
          <PlanBlock title="Push" exercises={7} />
          <PlanBlock title="Pull" exercises={4} />
          <PlanBlock title="Legs" exercises={3} />
        </div>
      </div>
    </>
  );
};

export default MainPage;
