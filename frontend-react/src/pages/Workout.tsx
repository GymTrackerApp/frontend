import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import WorkoutForm from "../components/WorkoutForm";
import {
  getTrainingPlanById,
  type PlanResponse,
} from "../services/trainingService";
import type { ErrorResponse } from "../types/ApiResponse";

const Workout = () => {
  const [searchParams] = useSearchParams();
  const trainingPlanId = searchParams.get("trainingPlanId");

  const {
    data: plan,
    isLoading,
    isError,
  } = useQuery<PlanResponse, ErrorResponse>({
    queryFn: () => getTrainingPlanById(Number(trainingPlanId!)),
    queryKey: ["trainingPlan", trainingPlanId],
    enabled: !!trainingPlanId,
  });

  return (
    <>
      {isError ? (
        <p>Failed to fetch training plan.</p>
      ) : isLoading ? (
        <p>Loading training plan...</p>
      ) : !plan ? (
        <p>Failed to fetch training plan.</p>
      ) : (
        <WorkoutForm key={JSON.stringify(plan)} plan={plan} />
      )}
    </>
  );
};

export default Workout;
