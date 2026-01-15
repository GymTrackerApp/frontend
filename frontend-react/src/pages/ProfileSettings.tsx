import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import {
  FaCalendar,
  FaEnvelope,
  FaLock,
  FaPencilAlt,
  FaUser,
} from "react-icons/fa";
import { useNavigate } from "react-router";
import Sidebar from "../components/Sidebar";
import Button from "../components/ui/Button";
import MainPagePanel from "../components/ui/MainPagePanel";
import { useUserProfile } from "../hooks/useUserProfile";
import { signOut } from "../services/authService";
import type { ErrorResponse, GeneralResponse } from "../types/ApiResponse";
import { displayLongFormattedDate } from "../utils/dateUtils";

const ProfileSettings = () => {
  const navigate = useNavigate();

  const {
    data: userProfile,
    isLoading: isUserProfileLoading,
    isError: isUserProfileError,
  } = useUserProfile();

  const signOutMutation = useMutation<
    GeneralResponse,
    AxiosError<ErrorResponse>,
    { refreshToken: string }
  >({
    mutationFn: signOut,
    onSuccess: (response) => {
      toast.success(response.message);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/register-login");
    },
    onError: (error) => {
      if (error.response?.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    },
  });

  const handleLogout = () => {
    if (signOutMutation.isPending) return;

    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      toast.error("User is not logged in");
      navigate("/register-login", { replace: true });
      return;
    }

    const data = {
      refreshToken: refreshToken,
    };

    signOutMutation.mutate(data);
  };

  return (
    <>
      <Sidebar username={userProfile?.username} isOpen={false} />
      <div className="w-full min-h-dvh bg-background-main text-white p-2">
        <h1 className="text-2xl font-bold">Profile Settings</h1>
        <p className="text-subcomponents-text-main mb-2">
          Manage your account and preferences
        </p>
        <MainPagePanel title={"Profile information"}>
          {isUserProfileError ? (
            <p className="mt-3">Failed to fetch user profile information</p>
          ) : isUserProfileLoading || !userProfile ? (
            <p className="mt-3">Loading...</p>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="mt-3 flex justify-between items-center">
                <div className="flex gap-2 items-center">
                  <FaUser />
                  <div className="flex flex-col">
                    <span className="text-subcomponents-text-main">
                      Username
                    </span>
                    <span>{userProfile.username}</span>
                  </div>
                </div>
                <FaPencilAlt className="cursor-pointer hover:opacity-80" />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <FaEnvelope />
                  <div className="flex flex-col">
                    <span className="text-subcomponents-text-main">Email</span>
                    <span>{userProfile.email}</span>
                  </div>
                </div>
                <FaPencilAlt className="cursor-pointer hover:opacity-80" />
              </div>
              <div className="flex items-center gap-3">
                <FaCalendar />
                <div className="flex flex-col">
                  <span className="text-subcomponents-text-main">
                    Member since
                  </span>
                  <span>
                    {displayLongFormattedDate(new Date(userProfile.createdAt))}
                  </span>
                </div>
              </div>
            </div>
          )}
        </MainPagePanel>
        <MainPagePanel title={"Security"}>
          <div className="flex justify-between items-center mt-3">
            <div className="flex items-center gap-3">
              <FaLock />
              <div>
                <span className="text-subcomponents-text-main">Password</span>
                <p className="text-sm">********</p>
              </div>
            </div>
            <Button
              btnStyle={"details"}
              size={"medium"}
              additionalStyle="rounded-xl"
            >
              <span>Change Password</span>
            </Button>
          </div>
        </MainPagePanel>
        <MainPagePanel title={"Account Actions"}>
          <button
            className="text-red-400 px-2 rounded-lg border border-red-400 cursor-pointer hover:opacity-80 mt-3"
            onClick={handleLogout}
            type="button"
          >
            Logout
          </button>
        </MainPagePanel>
      </div>
    </>
  );
};

export default ProfileSettings;
