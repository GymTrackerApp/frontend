import { privateApi, publicApi } from "../clients";

export interface NewExerciseRequest {
  name: string;
  category: string;
}

export interface ExerciseResponse {
  exerciseId: number;
  category: string;
  name: string;
}

export const createNewExercise = async (
  newExerciseRequest: NewExerciseRequest
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
