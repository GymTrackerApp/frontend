import { useQuery } from "@tanstack/react-query";
import { startOfWeek } from "date-fns";
import { useState } from "react";
import { FaBars, FaRegCalendar } from "react-icons/fa";
import MyPlans from "../components/MyPlans";
import QuickStart from "../components/QuickStart";
import QuickStats from "../components/QuickStats";
import RecentWorkouts from "../components/RecentWorkouts";
import Sidebar from "../components/Sidebar";
import { useUserProfile } from "../hooks/useUserProfile";
import { useAvailablePlans } from "../hooks/useWorkoutFlow";
import { getWorkouts } from "../services/workoutService";
import { getCurrentDate } from "../utils/dateUtils";

const MainPage = () => {
  const { plans, isLoading: plansLoading, userPlansOnly } = useAvailablePlans();

  const [sidebarVisible, setSidebarVisible] = useState(false);

  const {
    data: currentUser,
    isLoading: isCurrentUserLoading,
    isError: isCurrentUserError,
  } = useUserProfile();

  const displayCurrentDate = () => {
    const currentDate: Date = getCurrentDate();
    return currentDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  };

  const currentDate = getCurrentDate();
  const weekStartDate = startOfWeek(currentDate, { weekStartsOn: 1 });

  const {
    data: workoutsThisWeek,
    isLoading: isWorkoutsThisWeekLoading,
    isError: isWorkoutsThisWeekError,
  } = useQuery({
    queryFn: () => getWorkouts(weekStartDate, currentDate, null, 0, 10_000),
    queryKey: [
      "workoutsThisWeek",
      weekStartDate.getTime(),
      currentDate.getTime(),
    ],
    select: (data) =>
      data.map((workout) => {
        const createdAt = new Date(workout.createdAt);
        createdAt.setHours(0, 0, 0, 0);
        return {
          ...workout,
          createdAt: createdAt,
        };
      }),
  });

  return (
    <div
      className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white antialiased"
      onClick={() => setSidebarVisible(false)}
    >
      <div className="relative flex h-screen w-full overflow-hidden">
        <Sidebar username={currentUser?.username} isOpen={sidebarVisible} />
        <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark scrollbar-none">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-6 md:p-10 lg:p-12">
            <header className="flex flex-wrap items-end justify-between gap-4">
              <div className="flex flex-col gap-1">
                {isCurrentUserLoading || isCurrentUserError || !currentUser ? (
                  <div className="h-10 w-70 bg-gray-200 dark:bg-gray-800 animate-skeleton rounded-lg"></div>
                ) : (
                  <h1 className="font-display text-3xl md:text-4xl font-black tracking-tight text-gray-900 dark:text-white">
                    Welcome back, {currentUser.username}!
                  </h1>
                )}
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <FaRegCalendar size={18} />
                  <p className="text-sm font-medium">{displayCurrentDate()}</p>
                </div>
              </div>
              <button
                className="md:hidden rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={(e) => {
                  e.stopPropagation();
                  setSidebarVisible(!sidebarVisible);
                }}
              >
                <FaBars />
              </button>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <QuickStart
                data={plans}
                isLoading={plansLoading}
                workoutsThisWeek={workoutsThisWeek?.length || 0}
              />
              <QuickStats
                workoutsThisWeek={workoutsThisWeek}
                isWorkoutsThisWeekLoading={isWorkoutsThisWeekLoading}
                isWorkoutsThisWeekError={isWorkoutsThisWeekError}
              />
              <MyPlans userPlans={userPlansOnly} plansLoading={plansLoading} />
              <RecentWorkouts />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
