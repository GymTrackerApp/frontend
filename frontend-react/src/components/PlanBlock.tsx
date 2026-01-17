import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { FaDumbbell, FaPlay, FaStopwatch } from "react-icons/fa";
import type { PlanResponse } from "../services/trainingService";
import { getWorkouts } from "../services/workoutService";
import { calculateAverageTrainingTime } from "../utils/plansUtils";

interface PlanBlockProps {
  plan: PlanResponse;
}

const PlanBlock = ({ plan }: PlanBlockProps) => {
  const {
    data: lastWorkout,
    isLoading: isLastWorkoutLoading,
    isError: isLastWorkoutError,
  } = useQuery({
    queryFn: () => getWorkouts(null, null, plan.id, 0, 1),
    queryKey: ["lastWorkout", plan.id],
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
    <div className="relative flex flex-col justify-between overflow-hidden rounded-xl bg-white dark:bg-surface-dark p-5 shadow-sm ring-1 ring-gray-900/5 transition-all hover:ring-primary/50 dark:ring-white/10 dark:hover:ring-primary/50">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="font-bold text-gray-900 dark:text-white">
            {plan.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {isLastWorkoutLoading
              ? "Loading..."
              : isLastWorkoutError || !lastWorkout || lastWorkout?.length === 0
              ? "Never performed"
              : `Last done: ${formatDistanceToNow(
                  lastWorkout[0].createdAt
                )} ago`}
          </p>
        </div>
        <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-primary hover:text-white dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-primary dark:hover:text-white cursor-pointer">
          <FaPlay size={20} className="ms-1" />
        </button>
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
        <FaStopwatch size={14} />
        <span>~ {calculateAverageTrainingTime(plan)} min</span>
        <span className="text-gray-300 dark:text-gray-700">|</span>
        <FaDumbbell size={14} className="rotate-45" />
        <span>
          {plan.planItems.length}{" "}
          {plan.planItems.length == 1 ? "Exercise" : "Exercises"}
        </span>
      </div>
    </div>
  );
};

export default PlanBlock;
