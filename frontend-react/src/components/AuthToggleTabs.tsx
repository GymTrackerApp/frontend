import clsx from "clsx";

interface AuthToggleProps {
  isRegister: boolean;
  setIsRegister: (arg: boolean) => void;
}

const AuthToggleTabs = ({ isRegister, setIsRegister }: AuthToggleProps) => {
  const btnCommonStyle = "w-full rounded-t-md cursor-pointer";
  return (
    <div className="flex">
      <button
        className={clsx(
          btnCommonStyle,
          isRegister ? "bg-gray-700" : "bg-blue-500"
        )}
        onClick={() => setIsRegister(false)}
      >
        Login
      </button>
      <button
        className={clsx(
          btnCommonStyle,
          isRegister ? "bg-blue-500" : "bg-gray-700"
        )}
        onClick={() => setIsRegister(true)}
      >
        Register
      </button>
    </div>
  );
};

export default AuthToggleTabs;
