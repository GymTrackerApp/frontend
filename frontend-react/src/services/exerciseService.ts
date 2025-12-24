import axios from "axios";

export interface NewExerciseRequest {
  name: string;
  category: string;
}

export interface ExerciseResponse {
  exerciseId: number;
  name: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const createNewExercise = async (
  newExerciseRequest: NewExerciseRequest
): Promise<ExerciseResponse> => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.post<ExerciseResponse>(
    `${API_URL}/exercises`,
    newExerciseRequest,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
