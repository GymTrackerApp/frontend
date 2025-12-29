import { privateApi } from "../clients";
import type { GeneralResponse } from "../types/ApiResponse";

export interface ExerciseSet {
  reps: number;
  weight: number;
}

export interface WorkoutItem {
  exerciseId: number;
  sets: Array<ExerciseSet>;
  type: string;
}

export interface WorkoutCreationRequest {
  trainingId: number;
  workoutItems: Array<WorkoutItem>;
}

export const createWorkout = async (
  workoutCreationRequest: WorkoutCreationRequest
): Promise<GeneralResponse> => {
  const response = await privateApi.post("/workouts", workoutCreationRequest);
  return response.data;
};

export interface SetDetail {
  reps: number;
  weight: number;
}

export interface WorkoutSessionSnapshot {
  workoutId: number;
  workoutDate: string;
  sets: Array<SetDetail>;
}

export interface WorkoutExerciseHistoryResponse {
  exerciseId: number;
  history: Array<WorkoutSessionSnapshot>;
}

export const getWorkoutExerciseHistory = async (
  exerciseId: number,
  previousWorkouts: number = 3
): Promise<WorkoutExerciseHistoryResponse> => {
  const response = await privateApi.get(
    `/workouts/exercises/${exerciseId}/history?previousWorkouts=${previousWorkouts}`
  );
  return response.data;
};
