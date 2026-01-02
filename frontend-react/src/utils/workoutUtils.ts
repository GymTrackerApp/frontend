import type { WorkoutResponse } from "../services/workoutService";

export const calculateWorkoutVolume = (workout: WorkoutResponse) => {
  return workout.workoutItems.reduce(
    (prev, curr) =>
      prev +
      curr.sets.reduce((prev, curr) => prev + curr.reps * curr.weight, 0),
    0
  );
};