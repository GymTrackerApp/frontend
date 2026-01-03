import { useQuery } from "@tanstack/react-query";
import MainPagePanel from "./ui/MainPagePanel";
import { getWorkouts } from "../services/workoutService";
import { startOfWeek } from "date-fns";
import { displayShortFormattedDate } from "../utils/dateUtils";

const QuickStats = () => {
  const getCurrentDate = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  };

  const currentDate = getCurrentDate();
  const weekStartDate = startOfWeek(currentDate);

  const {
    data: workoutsThisWeek,
    isLoading: isWorkoutsThisWeekLoading,
    isError: isWorkoutsThisWeekError,
  } = useQuery({
    queryFn: () =>
      getWorkouts(startOfWeek(getCurrentDate()), getCurrentDate(), 0, 10_000),
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

  const {
    data: lastWorkout,
    isLoading: isLastWorkoutLoading,
    isError: isLastWorkoutError,
  } = useQuery({
    queryFn: () => getWorkouts(null, null, 0, 1),
    queryKey: ["lastWorkout"],
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

  const getDaysDifference = (date: Date) => {
    const now: Date = new Date();
    now.setHours(0, 0, 0, 0);

    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return "Today";
    } else if (diffInDays === 1) {
      return "Yesterday";
    } else {
      return `${diffInDays} days ago`;
    }
  };

  return (
    <MainPagePanel
      title="Quick Stats"
      detailsPageLink="/progress"
      detailsPageButtonTitle="View Full Progress"
    >
      <div className="flex justify-between gap-5 mt-5">
        <section className="w-full bg-subcomponents-main text-subcomponents-text-main p-2">
          <p>This week</p>
          <p className="text-white">
            {isWorkoutsThisWeekError
              ? "--"
              : isWorkoutsThisWeekLoading
              ? "Loading..."
              : workoutsThisWeek?.length}
          </p>
          <p>workouts</p>
        </section>
        <section className="w-full bg-subcomponents-main text-white p-2">
          <p className="text-subcomponents-text-main">Last Workout</p>
          {isLastWorkoutError ? (
            <p>Cannot fetch...</p>
          ) : isLastWorkoutLoading ? (
            <p>Loading...</p>
          ) : !lastWorkout || lastWorkout.length === 0 ? (
            <p>No workouts yet</p>
          ) : (
            <>
              <p>{displayShortFormattedDate(lastWorkout[0].createdAt)}</p>
              <p className="text-subcomponents-text-main">
                {getDaysDifference(lastWorkout[0].createdAt)}
              </p>
            </>
          )}
        </section>
      </div>
    </MainPagePanel>
  );
};

export default QuickStats;
