import { formatDate } from "date-fns";
import { FaRegCalendar, FaUserCircle } from "react-icons/fa";
import PageWrapper from "../components/ui/PageWrapper";
import ProfileSectionLoading from "../components/ProfileSectionLoading";
import { useUserProfile } from "../hooks/useUserProfile";

const ProfileSettings = () => {
  const {
    data: userProfile,
    isLoading: isUserProfileLoading,
    isError: isUserProfileError,
  } = useUserProfile();

  const showUserProfile =
    !!userProfile && !isUserProfileLoading && !isUserProfileError;

  return (
    <PageWrapper>
      <div className="p-8 lg:p-12 lg:max-w-3/4 mx-auto space-y-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white">
            Account Settings
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Manage your account
          </p>
        </div>
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight px-1">Profile</h2>
          </div>
          {!showUserProfile ? (
            <ProfileSectionLoading />
          ) : (
            <div className="bg-white dark:bg-card-dark rounded-xl border border-gray-200 dark:border-border-dark p-6 overflow-hidden relative">
              <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                <FaUserCircle className="w-32 h-32 rounded-2xl bg-cover bg-center shrink-0 shadow-2xl" />
                <div className="flex-1 space-y-4 text-center md:text-left">
                  <div className="space-y-1">
                    <p className="text-3xl font-black text-gray-900 dark:text-white">
                      {userProfile.username}
                    </p>
                    <p className="text-gray-500 font-medium">
                      {userProfile.email}
                    </p>
                    <p className="text-sm text-primary font-semibold flex items-center justify-center md:justify-start gap-1">
                      <FaRegCalendar className="text-sm" />
                      Member Since:{" "}
                      {formatDate(
                        new Date(userProfile.createdAt),
                        "dd MMM yyyy"
                      )}
                    </p>
                  </div>
                  <div className="w-full flex lg:flex-col lg:w-3/4 xl:w-1/2 gap-2">
                    <button className="w-full bg-gray-100 dark:bg-border-dark hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-6 py-2 rounded-lg font-bold transition-colors cursor-pointer">
                      Edit Profile Details
                    </button>
                    <button className="w-full py-2 bg-primary/10 text-primary hover:bg-primary/20 font-bold rounded-lg transition-colors flex items-center justify-center gap-2 px-6 cursor-pointer">
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
              <div className="absolute -right-12 -top-12 size-48 bg-primary/5 rounded-full blur-3xl"></div>
            </div>
          )}
        </section>
      </div>
    </PageWrapper>
  );
};

export default ProfileSettings;
