import axios from "axios";
import type { GeneralResponse } from "../types/ApiResponse";

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
  username: string;
  token: string;
}

export interface SignUpRequest {
  username: string;
  email: string;
  password: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const signIn = async (data: SignInRequest): Promise<SignInResponse> => {
  const response = await axios.post<SignInResponse>(
    `${API_URL}/auth/sign-in`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const signUp = async (data: SignUpRequest): Promise<GeneralResponse> => {
  const response = await axios.post<GeneralResponse>(
    `${API_URL}/auth/sign-up`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};
