import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import Header from "../components/Header";
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
    queryFn: () => getTrainingPlanById(trainingPlanId!),
    queryKey: ["trainingPlan", trainingPlanId],
    enabled: !!trainingPlanId,
  });

  return (
    <>
      <Header />
      {isError ? (
        <p>Failed to fetch training plan.</p>
      ) : isLoading ? (
        <p>Loading training plan...</p>
      ) : (
        <WorkoutForm plan={plan!} />
      )}
    </>
  );
};

export default Workout;
