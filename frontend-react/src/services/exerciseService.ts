import { privateApi, publicApi } from "../clients";
import type { GeneralResponse } from "../types/ApiResponse";

export const EXERCISE_CATEGORIES = [
  "CHEST",
  "LEGS",
  "BACK",
  "ARMS",
  "SHOULDERS",
  "CORE",
  "GLUTES",
  "GENERAL",
  "UNCATEGORIZED",
] as const;

export type ExerciseCategory = (typeof EXERCISE_CATEGORIES)[number];

export interface ExerciseCreationRequest {
  name: string;
  category: string;
}

export interface ExerciseResponse {
  exerciseId: number;
  category: string;
  name: string;
}

export const createNewExercise = async (
  newExerciseRequest: ExerciseCreationRequest
): Promise<ExerciseResponse> => {
  const response = await privateApi.post("/exercises", newExerciseRequest);
  return response.data;
};

export const getUserExercises = async (): Promise<Array<ExerciseResponse>> => {
  const response = await privateApi.get("/exercises/user");
  return response.data;
};

export const getPredefinedExercises = async (): Promise<
  Array<ExerciseResponse>
> => {
  const response = await publicApi.get("/exercises");
  return response.data;
};

export const removeExercise = async (
  exerciseId: number
): Promise<GeneralResponse> => {
  const response = await privateApi.delete(`/exercises/${exerciseId}`);
  return response.data;
};

export interface UpdateExerciseProps {
  exerciseId: number;
  request: ExerciseCreationRequest;
}

export const updateExercise = async ({
  exerciseId,
  request,
}: UpdateExerciseProps): Promise<ExerciseResponse> => {
  const response = await privateApi.put(`/exercises/${exerciseId}`, request);
  return response.data;
};
