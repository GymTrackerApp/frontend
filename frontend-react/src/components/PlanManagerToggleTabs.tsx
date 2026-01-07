import clsx from "clsx";

interface PlanManagerToggleProps {
  isMyPlansEnabled: boolean;
  isPredefinedPlansEnabled: boolean;
  isMyExercisesEnabled: boolean;
  setIsMyPlansEnabled: (arg: boolean) => void;
  setIsPredefinedPlansEnabled: (arg: boolean) => void;
  setIsMyExercisesEnabled: (arg: boolean) => void;
}

const PlanManagerToggleTabs = ({
  isMyPlansEnabled,
  isPredefinedPlansEnabled,
  isMyExercisesEnabled,
  setIsMyPlansEnabled,
  setIsPredefinedPlansEnabled,
  setIsMyExercisesEnabled,
}: PlanManagerToggleProps) => {
  const toggleButtonsCommonStyle = "px-3 rounded-md cursor-pointer";
  const enabledButtonColor = "bg-blue-500";
  const disabledButtonColor = "bg-gray-700";

  const disableAllButtons = () => {
    setIsMyPlansEnabled(false);
    setIsPredefinedPlansEnabled(false);
    setIsMyExercisesEnabled(false);
  };

  return (
    <div className="flex gap-2 mb-2 w-full">
      <button
        className={clsx(
          toggleButtonsCommonStyle,
          isMyPlansEnabled ? enabledButtonColor : disabledButtonColor
        )}
        onClick={() => {
          disableAllButtons();
          setIsMyPlansEnabled(true);
        }}
      >
        My Plans
      </button>
      <button
        className={clsx(
          toggleButtonsCommonStyle,
          isPredefinedPlansEnabled ? enabledButtonColor : disabledButtonColor
        )}
        onClick={() => {
          disableAllButtons();
          setIsPredefinedPlansEnabled(true);
        }}
      >
        Predefined Plans
      </button>
      <button
        className={clsx(
          toggleButtonsCommonStyle,
          isMyExercisesEnabled ? enabledButtonColor : disabledButtonColor
        )}
        onClick={() => {
          disableAllButtons();
          setIsMyExercisesEnabled(true);
        }}
      >
        My Exercises
      </button>
    </div>
  );
};

export default PlanManagerToggleTabs;
