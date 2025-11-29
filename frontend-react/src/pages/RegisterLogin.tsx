import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState } from "react";
import type { ErrorResponse } from "react-router";
import AuthToggleTabs from "../components/AuthToggleTabs";
import InputForm from "../components/InputForm";
import {
  signIn,
  type SignInRequest,
  type SignInResponse,
  signUp,
  type SignUpRequest,
} from "../services/userService";
import type { GeneralResponse } from "../types/ApiResponse";
import { type SignInForm, type SignUpForm } from "../types/AuthForms";

const RegisterLogin = () => {
  const [isRegister, setIsRegister] = useState<boolean>(false);

  const [signInFormData, setSignInFormData] = useState<SignInForm>({
    email: "",
    password: "",
  });

  const [signUpFormData, setSignUpFormData] = useState<
    Omit<SignUpForm, keyof SignInForm>
  >({
    username: "",
  });

  const signUpMutation = useMutation<
    GeneralResponse,
    AxiosError<ErrorResponse>,
    SignUpRequest
  >({
    mutationFn: signUp,
    onSuccess: (data) => {
      alert("Sign up successful");
      console.log(data);
    },
    onError: (error) => {
      alert("Sign up failed");
      console.log(error);
    },
  });

  const signInMutation = useMutation<
    SignInResponse,
    AxiosError<ErrorResponse>,
    SignInRequest
  >({
    mutationFn: signIn,
    onSuccess: (data) => {
      alert("Sign in successful");
      console.log(data);
    },
    onError: (error) => {
      alert("Sign in failed");
      console.log(error);
    },
  });

  const handleFormChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;

    if (fieldName in signInFormData) {
      setSignInFormData({
        ...signInFormData,
        [fieldName]: fieldValue,
      });
    } else {
      setSignUpFormData({
        ...signUpFormData,
        [fieldName]: fieldValue,
      });
    }
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();

    if (signInMutation.isPending) return;

    const data: SignInRequest = {
      email: signInFormData.email,
      password: signInFormData.password,
    };

    signInMutation.mutate(data);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();

    if (signUpMutation.isPending) return;

    const data: SignUpRequest = {
      username: signUpFormData.username,
      email: signInFormData.email,
      password: signInFormData.password,
    };

    signUpMutation.mutate(data);
  };

  return (
    <>
      <div className="bg-blue-950 text-white min-h-dvh flex justify-center items-center flex-col">
        <h1 className="text-3xl font-bold">Gym Tracker</h1>
        <p className="text-gray-400 mb-5">
          Track your progress, achieve your goals
        </p>
        <div className="w-1/2">
          <AuthToggleTabs
            isRegister={isRegister}
            setIsRegister={setIsRegister}
          />
          <form
            className="bg-gray-700 flex flex-col rounded-b-xl"
            onSubmit={isRegister ? handleSignUp : handleSignIn}
          >
            {isRegister && (
              <InputForm
                label="Username"
                id="username"
                name="username"
                type="text"
                placeholder="John Doe"
                onChange={handleFormChange}
                required
              />
            )}

            <InputForm
              label="Email"
              id="email"
              name="email"
              type="email"
              placeholder="john.doe@domain.com"
              onChange={handleFormChange}
              required
            />

            <InputForm
              label="Password"
              id="password"
              name="password"
              type="password"
              placeholder="password"
              onChange={handleFormChange}
              required
            />

            <button
              className="bg-blue-500 rounded-xl py-0.5 cursor-pointer"
              type="submit"
              disabled={signInMutation.isPending || signUpMutation.isPending}
            >
              {isRegister ? "Register" : "Login"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterLogin;
