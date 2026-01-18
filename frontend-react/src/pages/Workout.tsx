import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import WorkoutForm from "../components/WorkoutForm";
import {
  getTrainingPlanById,
  type PlanResponse,
} from "../services/trainingService";
import type { ErrorResponse } from "../types/ApiResponse";
import LoadingPage from "./LoadingPage";
import ErrorPage from "./ErrorPage";

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
        <ErrorPage />
      ) : isLoading || !plan ? (
        <LoadingPage
          title="Preparing your workout..."
          description="Loading your personalized plan, please wait."
        />
      ) : (
        <WorkoutForm key={JSON.stringify(plan)} plan={plan} />
      )}
    </>
  );
};

export default Workout;
