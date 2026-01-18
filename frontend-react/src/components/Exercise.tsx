import { FaDumbbell, FaPen, FaTrashAlt } from "react-icons/fa";
import type { ExerciseResponse } from "../services/exerciseService";
import { useState } from "react";
import ConfirmationWindow from "./ui/ConfirmationWindow";

interface ExerciseProps {
  exercise: ExerciseResponse;
  setUpdateExercise: (exercise: ExerciseResponse) => void;
  handleRemoveExercise: (exerciseId: number) => void;
}

const Exercise = ({
  exercise,
  setUpdateExercise,
  handleRemoveExercise,
}: ExerciseProps) => {
  const [isExerciseRemovalWindowOpened, setIsExerciseRemovalWindowOpened] =
    useState<boolean>(false);
  return (
    <div className="flex flex-col bg-surface-dark rounded-xl border border-border-dark overflow-hidden hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/5">
      <div className="p-5 flex flex-col justify-between gap-4 flex-1">
        <div className="flex justify-between items-start">
          <div className="flex items-center justify-between gap-3 w-full">
            <h3 className="text-white text-lg font-bold leading-tight mb-1">
              {exercise.name}
            </h3>
            <div className="flex">
              <button
                className="flex items-center justify-center h-7 w-7 rounded-lg border border-border-dark text-gray-400 hover:text-white hover:border-gray-500 transition-colors cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setUpdateExercise(exercise);
                }}
              >
                <FaPen size={14} />
              </button>
              <button
                className="flex items-center justify-center h-7 w-7 rounded-lg border border-border-dark text-gray-400 hover:text-red-400 hover:border-red-400 transition-colors cursor-pointer"
                onClick={() => setIsExerciseRemovalWindowOpened(true)}
              >
                <FaTrashAlt size={14} />
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
          <div className="flex items-center gap-1.5">
            <FaDumbbell size={15} className="rotate-45" />
            <span>{exercise.category}</span>
          </div>
        </div>
      </div>
      {isExerciseRemovalWindowOpened && (
        <ConfirmationWindow
          onConfirm={() => {
            handleRemoveExercise(exercise.exerciseId);
          }}
          onClose={() => setIsExerciseRemovalWindowOpened(false)}
          confirmButtonText={"Yes, Remove Exercise"}
          cancelButtonText={"No, Keep Exercise"}
          windowTitle={"Remove Exercise"}
          windowDescription={
            "Are you sure you want to remove this exercise? This action may affect existing workout plans."
          }
        />
      )}
    </div>
  );
};

export default Exercise;
