import { Link, useNavigate } from "react-router-dom";
import type { PlanResponse } from "../services/trainingService";
import CreateNewResource from "./CreateNewResource";
import PlanBlock from "./PlanBlock";
import PlanBlockLoading from "./PlanBlockLoading";

interface MyPlansProps {
  userPlans: Array<PlanResponse> | undefined;
  plansLoading: boolean;
}

const MyPlans = ({ userPlans, plansLoading }: MyPlansProps) => {
  const navigate = useNavigate();

  return (
    <div className="col-span-3 flex flex-col gap-6">
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
        <CreateNewResource
          creationText={"Create New Plan"}
          onNewResourceCreated={() => {
            navigate("/plan-manager");
          }}
        />
      </div>
    </div>
  );
};

export default MyPlans;
