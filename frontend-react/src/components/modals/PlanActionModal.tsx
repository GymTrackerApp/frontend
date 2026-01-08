import { useState } from "react";
import type { ExerciseResponse } from "../../services/exerciseService";
import AbsoluteWindowWrapper from "../ui/AbsoluteWindowWrapper";
import Button from "../ui/Button";
import SelectOptionWindow from "../ui/SelectOptionWindow";

interface PlanActionModalProps {
  exercises: Array<ExerciseResponse>;
  handleSelectExercise: (exercise: ExerciseResponse) => void;
  title: string;
  handleSubmit: () => void;
  remainingFormElements: React.ReactNode;
  children: React.ReactNode;
  saveButtonText: string;
  onClose: () => void;
}

const PlanActionModal = ({
  exercises,
  handleSelectExercise,
  title,
  handleSubmit,
  remainingFormElements,
  children: planItems,
  saveButtonText,
  onClose,
}: PlanActionModalProps) => {
  const [addExerciseEnabled, setAddExerciseEnabled] = useState<boolean>(false);

  return (
    <AbsoluteWindowWrapper isOpen={true} onClose={onClose} windowSize="large">
      <form
        className="w-full"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <h1 className="text-2xl font-bold">{title}</h1>

        {remainingFormElements}

        <div className="flex justify-between items-center mb-3">
          <p className="font-bold">Exercises</p>
          <Button
            btnStyle="details"
            size="small"
            additionalStyle="rounded-md text-sm"
            onClick={(e) => {
              e.preventDefault();
              setAddExerciseEnabled(true);
            }}
          >
            <span>Add Exercise</span>
          </Button>
        </div>

        {addExerciseEnabled && (
          <SelectOptionWindow
            title={"Select Exercise"}
            onClose={() => setAddExerciseEnabled(false)}
            data={exercises}
            renderItem={(exercise) => (
              <p key={exercise.exerciseId} className="flex flex-col">
                <span>{exercise.name}</span>
                <span className="text-gray-400 text-sm capitalize">
                  {exercise.category.toLowerCase()}
                </span>
              </p>
            )}
            onSelect={handleSelectExercise}
          />
        )}

        {planItems}

        <div className="flex justify-between gap-3">
          <Button
            btnStyle="cancel"
            onClick={onClose}
            additionalStyle="rounded-xl w-full"
            size={"medium"}
            type="button"
          >
            <span>Cancel</span>
          </Button>
          <Button
            btnStyle="approve"
            size={"medium"}
            additionalStyle="rounded-xl w-full"
            type="submit"
          >
            <span>{saveButtonText}</span>
          </Button>
        </div>
      </form>
    </AbsoluteWindowWrapper>
  );
};

export default PlanActionModal;
