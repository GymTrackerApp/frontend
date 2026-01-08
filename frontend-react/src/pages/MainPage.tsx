import FetchHandler from "../components/FetchHandler";
import Header from "../components/Header";
import PlanBlock from "../components/PlanBlock";
import QuickStart from "../components/QuickStart";
import QuickStats from "../components/QuickStats";
import RecentWorkouts from "../components/RecentWorkouts";
import MainPagePanel from "../components/ui/MainPagePanel";
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
      <div className="bg-background-main text-white flex flex-col items-center min-h-dvh pt-3">
        <h1 className="text-3xl font-bold">Welcome back, John!</h1>
        <p className="text-gray-400">Ready to crush your workout?</p>
        <QuickStart data={plans} isLoading={plansLoading} />
        <QuickStats />
        <RecentWorkouts />
        <MainPagePanel
          title={"My Plans"}
          detailsPageLink="/plan-manager"
          detailsPageButtonTitle="Plan Manager"
        >
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
        </MainPagePanel>
      </div>
    </>
  );
};

export default MainPage;
