import { privateApi, publicApi } from "../clients";
import type { GeneralResponse } from "../types/ApiResponse";

export interface PlanItemResponse {
  exerciseId: number;
  exerciseName: string;
  defaultSets: number;
}

export interface PlanResponse {
  id: number;
  name: string;
  isCustom: boolean;
  planItems: Array<PlanItemResponse>;
}

export interface PlanItemRequest {
  exerciseId: number;
  defaultSets: number;
}

export interface PlanRequest {
  planName: string;
  planItems: Array<PlanItemRequest>;
}

export const getPredefinedPlans = async (): Promise<Array<PlanResponse>> => {
  const response = await publicApi.get("/plans");
  return response.data;
};

export const getUserPlans = async (): Promise<Array<PlanResponse>> => {
  const response = await privateApi.get("/plans/user");
  return response.data;
};

export const getTrainingPlanById = async (
  trainingPlanId: number
): Promise<PlanResponse> => {
  const response = await privateApi.get(`/plans/${trainingPlanId}`);
  return response.data;
};

export const createUserPlan = async (
  requestData: PlanRequest
): Promise<GeneralResponse> => {
  const response = await privateApi.post("/plans", requestData);
  return response.data;
};
