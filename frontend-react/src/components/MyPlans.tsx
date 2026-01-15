import { FaPlus } from "react-icons/fa";
import { Link } from "react-router";
import type { PlanResponse } from "../services/trainingService";
import PlanBlock from "./PlanBlock";
import PlanBlockLoading from "./PlanBlockLoading";

interface MyPlansProps {
  userPlans: Array<PlanResponse> | undefined;
  plansLoading: boolean;
}

const MyPlans = ({ userPlans, plansLoading }: MyPlansProps) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          My Plans
        </h2>
        <Link
          className="text-sm font-medium text-primary hover:text-blue-500"
          to="/plan-manager"
        >
          View all
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {plansLoading || !userPlans ? (
          <PlanBlockLoading />
        ) : (
          userPlans.map((plan) => <PlanBlock key={plan.id} plan={plan} />)
        )}
        <div className="group relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-transparent p-5 text-center transition-colors hover:border-primary hover:bg-primary/5 dark:hover:border-primary dark:hover:bg-primary/5 cursor-pointer min-h-[140px]">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 group-hover:text-primary transition-colors">
            <FaPlus />
          </div>
          <span className="text-sm font-medium text-gray-500 group-hover:text-primary dark:text-gray-400 transition-colors">
            Create New Plan
          </span>
        </div>
      </div>
    </div>
  );
};

export default MyPlans;
