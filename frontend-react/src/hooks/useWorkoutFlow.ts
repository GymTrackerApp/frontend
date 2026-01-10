import { useQuery } from "@tanstack/react-query";
import {
  getPredefinedPlans,
  getUserPlans,
  type PlanResponse,
} from "../services/trainingService";
import type { ErrorResponse } from "../types/ApiResponse";
import {
  getPredefinedExercises,
  getUserExercises,
  type ExerciseResponse,
} from "../services/exerciseService";
import { exerciseSorting } from "../utils/sortingUtils";

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

export const useAvailableExercises = () => {
  const userExercises = useQuery<Array<ExerciseResponse>, ErrorResponse>({
    queryFn: getUserExercises,
    queryKey: ["userExercises"],
  });

  const predefinedExercises = useQuery<Array<ExerciseResponse>, ErrorResponse>({
    queryFn: getPredefinedExercises,
    queryKey: ["predefinedExercises"],
  });

  const allExercises = [
    ...(userExercises.data || []),
    ...(predefinedExercises.data || []),
  ].sort(exerciseSorting);

  return {
    exercises: allExercises,
    isLoading: userExercises.isLoading || predefinedExercises.isLoading,
    isError: userExercises.isError || predefinedExercises.isError,
    userExercisesOnly: userExercises.data,
  };
};
