import { useQuery } from "@tanstack/react-query";
import {
  getPredefinedPlans,
  getUserPlans,
  type PlanResponse,
} from "../services/trainingService";
import type { ErrorResponse } from "../types/ApiResponse";

export const useAvailablePlans = () => {
  const userPlans = useQuery<Array<PlanResponse>, ErrorResponse>({
    queryFn: getUserPlans,
    queryKey: ["userPlans"],
  });

  const predefinedPlans = useQuery<Array<PlanResponse>, ErrorResponse>({
    queryFn: getPredefinedPlans,
    queryKey: ["predefinedPlans"],
  });

  const allPlans = [...(userPlans.data || []), ...(predefinedPlans.data || [])];

  return {
    plans: allPlans,
    isLoading: userPlans.isLoading || predefinedPlans.isLoading,
    isError: userPlans.isError || predefinedPlans.isError,
    userPlansOnly: userPlans.data,
  };
};
