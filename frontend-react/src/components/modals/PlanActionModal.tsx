import { useState } from "react";
import {
  FaEdit,
  FaListAlt,
  FaPlusCircle,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import type { ExerciseResponse } from "../../services/exerciseService";
import ExerciseSelectionOption from "../ExerciseSelectionOption";
import AbsoluteWindowWrapper from "../ui/AbsoluteWindowWrapper";
import SelectOptionWindow from "../ui/SelectOptionWindow";
import { exercisesFilter } from "../../utils/exerciseUtils";

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
    <AbsoluteWindowWrapper isOpen={true} onClose={onClose}>
      <header className="flex-none flex items-center justify-between border-b border-surface-border px-6 py-4 z-20">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <FaEdit className="text-lg" />
          </div>
          <h2 className="text-white text-lg font-bold tracking-tight">
            {title}
          </h2>
        </div>
        <button
          className="group flex size-9 cursor-pointer items-center justify-center rounded-full hover:bg-surface-border text-text-muted hover:text-white transition-colors"
          onClick={onClose}
        >
          <FaTimes size={18} />
        </button>
      </header>

      <form
        className="h-full overflow-hidden flex flex-col"
        onSubmit={handleSubmit}
      >
        <div className="flex-1 overflow-y-auto scrollbar-none px-4 py-8 md:px-0">
          <div className="mx-auto max-w-2xl px-6 py-12 flex flex-col gap-10">
            {remainingFormElements}

            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-semibold text-text-main flex items-center gap-2">
                  <FaListAlt className="text-primary text-lg" />
                  Plan Exercises
                </h3>
              </div>
              <div className="flex flex-col gap-px bg-surface-border/30 rounded-xl overflow-hidden border border-surface-border">
                <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-surface-dark/50 text-[10px] font-bold text-text-muted uppercase tracking-widest border-b border-surface-border">
                  <div className="col-span-8 md:col-span-9 my-auto">
                    Exercise
                  </div>
                  <div className="col-span-3 md:col-span-2 text-center my-auto">
                    Default Sets
                  </div>
                  <div className="col-span-1"></div>
                </div>
                {planItems}
                <button
                  className="flex w-full items-center justify-center gap-2 bg-surface-dark/40 py-5 text-sm font-semibold text-primary hover:bg-primary/10 transition-all group border-t border-surface-border/50"
                  onClick={(e) => {
                    e.preventDefault();
                    setAddExerciseEnabled(true);
                  }}
                >
                  <FaPlusCircle className="text-xl group-hover:scale-110 transition-transform" />
                  Add Exercise
                </button>
              </div>
            </div>
          </div>
        </div>
        <footer className="flex-none border-t border-surface-border bg-background-dark p-6 z-30">
          <div className="mx-auto max-w-2xl flex items-center justify-between">
            <button
              className="px-4 py-2 text-sm font-medium text-text-muted hover:text-white transition-colors cursor-pointer"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="flex items-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-bold text-white shadow-lg shadow-primary/25 hover:bg-primary-dark hover:-translate-y-px transition-all active:translate-y-0 active:scale-95 cursor-pointer"
              type="submit"
            >
              <FaSave className="text-xl" />
              {saveButtonText}
            </button>
          </div>
        </footer>
      </form>

      {addExerciseEnabled && (
        <SelectOptionWindow
          title={"Select Exercise"}
          onClose={() => setAddExerciseEnabled(false)}
          data={exercises}
          renderItem={(exercise) => (
            <ExerciseSelectionOption exercise={exercise} />
          )}
          onSelect={handleSelectExercise}
          dataFilter={exercisesFilter}
        />
      )}
    </AbsoluteWindowWrapper>
  );
};

export default PlanActionModal;
