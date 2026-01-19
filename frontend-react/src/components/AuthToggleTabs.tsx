import clsx from "clsx";

interface AuthToggleProps {
  isRegister: boolean;
  setIsRegister: (arg: boolean) => void;
}

const AuthToggleTabs = ({ isRegister, setIsRegister }: AuthToggleProps) => {
  return (
    <div className="flex border-b border-border-dark">
      <button
        type="button"
        className={clsx(
          "flex-1 py-4 text-center text-sm font-semibold border-b-2 transition-colors rounded-tl-4xl",
          isRegister
            ? "border-transparent text-text-muted"
            : "border-primary text-white bg-white/5"
        )}
        onClick={() => setIsRegister(false)}
      >
        Login
      </button>
      <button
        type="button"
        className={clsx(
          "flex-1 py-4 text-center text-sm font-semibold text-text-muted hover:text-white border-b-2 transition-colors rounded-tr-4xl",
          isRegister
            ? "border-primary bg-white/5"
            : "border-transparent text-text-muted"
        )}
        onClick={() => setIsRegister(true)}
      >
        Register
      </button>
    </div>
  );
};

export default AuthToggleTabs;
