import { Link } from "react-router-dom";
import FetchHandler from "../components/FetchHandler";
import Header from "../components/Header";
import PlanBlock from "../components/PlanBlock";
import QuickStart from "../components/QuickStart";
import { useAvailablePlans } from "../hooks/useWorkoutFlow";

const MainPage = () => {
  const {
    plans,
    isLoading: plansLoading,
    isError: plansError,
    userPlansOnly,
  } = useAvailablePlans();

  return (
    <>
      <Header />
      <div className="bg-gray-800 text-white flex flex-col items-center min-h-dvh pt-3">
        <h1 className="text-3xl font-bold">Welcome back, John!</h1>
        <p className="text-gray-400">Ready to crush your workout?</p>
        <QuickStart data={plans} isLoading={plansLoading} />
        <div className="w-full px-2 pt-3 bg-gray-700 mt-5 pb-8">
          <div className="flex justify-between">
            <h1 className="text-2xl font-semibold">My Plans</h1>
            <Link to="/plan-manager">
              <button className="px-2 py-1 border-2 text-blue-500 border-blue-500 rounded-xl cursor-pointer hover:border-blue-400 hover:text-blue-400 transition-colors">
                Plan Manager
              </button>
            </Link>
          </div>
          <FetchHandler
            isEnabled={true}
            isLoading={plansLoading}
            isError={plansError}
            data={userPlansOnly}
            emptyMessage={"No plans found. Create one in the Plan Manager."}
          >
            {(userPlans) =>
              userPlans.map((plan) => (
                <PlanBlock
                  key={plan.id}
                  title={plan.name}
                  exercises={plan.planItems.length}
                />
              ))
            }
          </FetchHandler>
        </div>
      </div>
    </>
  );
};

export default MainPage;
