import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  FaArrowRight,
  FaDumbbell,
  FaEnvelope,
  FaLock,
  FaUser,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AuthToggleTabs from "../components/AuthToggleTabs";
import Button from "../components/ui/Button";
import {
  signIn,
  type SignInRequest,
  type SignInResponse,
  signUp,
  type SignUpRequest,
} from "../services/authService";
import { type ErrorResponse, type GeneralResponse } from "../types/ApiResponse";
import { type SignInForm, type SignUpForm } from "../types/AuthForms";

const RegisterLogin = () => {
  const navigate = useNavigate();
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
    onSuccess: () => {
      toast.success("Sign up successful. Please log in.");
      setIsRegister(false);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      if (error.response) {
        toast.error(error.response.data.message);
        console.log(error);
      } else {
        toast.error(`Sign up failed: ${error.message}`);
      }
    },
  });

  const signInMutation = useMutation<
    SignInResponse,
    AxiosError<ErrorResponse>,
    SignInRequest
  >({
    mutationFn: signIn,
    onSuccess: (response) => {
      toast.success("Sign in successful");
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      navigate("/", { replace: true });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      if (error.response) {
        const errorMessage: string = error.response.data.message;
        toast.error(errorMessage);
      } else {
        toast.error(
          `Sign in failed: ${error.message}. Something went wrong, please try again.`,
        );
      }
    },
  });

  const handleFormChange = (
    event: React.ChangeEvent<HTMLInputElement>,
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
      <div className="bg-background-light dark:bg-background-dark font-display text-gray-900 dark:text-white antialiased min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-light-grid-pattern dark:bg-dark-grid-pattern bg-size-[40px_40px] pointer-events-none opacity-15"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-transparent via-transparent to-background-light dark:to-background-dark pointer-events-none"></div>
        <div className="relative z-10 w-full max-w-115 px-4 py-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-linear-to-tr from-primary to-blue-400 flex items-center justify-center shadow-lg shadow-primary/30 mb-4">
              <FaDumbbell className="w-7 h-7 rotate-45 text-white dark:text-black" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Gym Tracker</h1>
            <p className="text-text-muted text-sm mt-1">
              Track progressive overload with precision.
            </p>
          </div>
          <AuthToggleTabs
            isRegister={isRegister}
            setIsRegister={setIsRegister}
          />
          <form
            className="bg-card-light dark:bg-card-dark border dark:border-border-dark border-border-light rounded-2xl rounded-t-none shadow-2xl overflow-hidden"
            onSubmit={isRegister ? handleSignUp : handleSignIn}
          >
            <div className="p-6 pt-8 space-y-5">
              {isRegister && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Username</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-text-muted text-[20px]" />
                    </div>
                    <input
                      className="block w-full rounded-lg bg-input-light dark:bg-input-dark border-border-light dark:border-border-dark text-black dark:text-white placeholder:text-text-muted dark:placeholder:text-text-muted/80 focus:border-primary focus:ring-1 focus:outline-none focus:ring-primary sm:text-sm pl-10 h-12 transition-all"
                      id="username"
                      name="username"
                      type="text"
                      placeholder="John Doe"
                      value={signUpFormData.username}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-text-muted text-[20px]" />
                  </div>
                  <input
                    className="block w-full rounded-lg bg-input-light dark:bg-input-dark border-border-light dark:border-border-dark text-black dark:text-white placeholder:text-text-muted dark:placeholder:text-text-muted/80 focus:border-primary focus:ring-1 focus:outline-none focus:ring-primary sm:text-sm pl-10 h-12 transition-all"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john.doe@domain.com"
                    value={signInFormData.email}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium">Password</label>
                  {!isRegister && (
                    <span className="text-xs cursor-pointer font-medium text-primary hover:text-primary-hover underline decoration-transparent hover:decoration-primary transition-all">
                      Forgot Password?
                    </span>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-text-muted text-[20px]" />
                  </div>
                  <input
                    className="block w-full rounded-lg bg-input-light dark:bg-input-dark border-border-light dark:border-border-dark text-black dark:text-white placeholder:text-text-muted dark:placeholder:text-text-muted/80 focus:border-primary focus:ring-1 focus:outline-none focus:ring-primary sm:text-sm pl-10 h-12 transition-all"
                    id="password"
                    name="password"
                    type="password"
                    placeholder="********"
                    value={signInFormData.password}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>
            </div>

            <Button
              btnStyle={"approve"}
              size={"big"}
              additionalStyle="w-full font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98]"
              disabled={signInMutation.isPending || signUpMutation.isPending}
            >
              <span>{isRegister ? "Register" : "Login"}</span>
              <FaArrowRight className="text-[20px]" />
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterLogin;
