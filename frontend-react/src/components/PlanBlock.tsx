import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { FaListUl, FaPlay, FaStopwatch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import type { PlanResponse } from "../services/trainingService";
import { getWorkouts } from "../services/workoutService";
import { getRelativeDate } from "../utils/dateUtils";
import { calculateAverageTrainingTime } from "../utils/plansUtils";

interface PlanBlockProps {
  plan: PlanResponse;
}

const PlanBlock = ({ plan }: PlanBlockProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

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

  const handleWorkoutStart = (trainingPlan: PlanResponse) => {
    toast.success(`Starting workout: ${trainingPlan.name}`);
    navigate("/workout?trainingPlanId=" + trainingPlan.id);
  };

  return (
    <div className="relative flex flex-col justify-between overflow-hidden rounded-xl bg-white dark:bg-card-dark p-5 shadow-sm ring ring-border-light/10 hover:ring-border-light hover:shadow-md transition-all dark:ring-white/10 hover:dark:ring-primary/50 hover:dark:shadow-none">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="font-bold text-gray-900 dark:text-white">
            {plan.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {isLastWorkoutLoading
              ? t("lastWorkoutLoading")
              : isLastWorkoutError
                ? "Could not load"
                : !lastWorkout || lastWorkout?.length === 0
                  ? t("neverPerfomed")
                  : `${t("lastDone")}: ${getRelativeDate(lastWorkout[0].createdAt)}`}
          </p>
        </div>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-primary hover:text-white dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-primary dark:hover:text-white cursor-pointer"
          onClick={() => handleWorkoutStart(plan)}
        >
          <FaPlay size={20} className="ms-1" />
        </button>
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
        <FaListUl size={14} />
        <span>{t("exercisesAmount", { count: plan.planItems.length })}</span>
        <span className="text-gray-300 dark:text-gray-700">|</span>
        <FaStopwatch size={14} />
        <span>
          {t("nMinutes", { count: calculateAverageTrainingTime(plan) })}
        </span>
      </div>
    </div>
  );
};

export default PlanBlock;
