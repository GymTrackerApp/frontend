import type { ExerciseResponse } from "../services/exerciseService";

export const exerciseSorting = (a: ExerciseResponse, b: ExerciseResponse) => {
  if (a.category < b.category) return -1;
  if (a.category > b.category) return 1;

  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;

  return 0;
};
