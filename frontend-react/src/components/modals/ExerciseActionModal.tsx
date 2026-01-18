import { FaEdit, FaPlus, FaTimes } from "react-icons/fa";
import AbsoluteWindowWrapper from "../ui/AbsoluteWindowWrapper";

interface CreateNewExerciseProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  handleFormSubmit: (e: React.FormEvent) => void;
  submitButtonTitle: string;
}

const ExerciseActionModal = ({
  title,
  children,
  onClose,
  handleFormSubmit,
  submitButtonTitle,
}: CreateNewExerciseProps) => {
  return (
    <AbsoluteWindowWrapper isOpen={true} onClose={onClose}>
      <header className="flex-none flex items-center justify-between border-b border-surface-border bg-background-dark/95 backdrop-blur-md px-6 py-4 z-20">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <FaEdit className="text-xl" />
          </div>
          <h2 className="text-white text-lg font-bold tracking-tight">
            {title}
          </h2>
        </div>
        <button
          className="group flex size-9 cursor-pointer items-center justify-center rounded-full hover:bg-surface-border text-text-muted hover:text-white transition-colors"
          onClick={onClose}
        >
          <FaTimes />
        </button>
      </header>

      <form className="w-full h-screen flex flex-col justify-between overflow-hidden">
        <div className="overflow-y-auto">{children}</div>
        <footer className="flex-none border-t border-surface-border bg-background-dark p-6 z-30">
          <div className="mx-auto max-w-xl flex items-center justify-between">
            <button
              className="px-6 py-2 text-sm font-medium text-text-muted hover:text-white transition-colors cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                onClose();
              }}
            >
              Cancel
            </button>
            <button
              className="flex items-center gap-2 rounded-xl bg-primary px-10 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/25 hover:bg-primary-dark hover:-translate-y-px transition-all active:translate-y-0 active:scale-95 cursor-pointer"
              onClick={handleFormSubmit}
              type="submit"
            >
              <FaPlus />
              {submitButtonTitle}
            </button>
          </div>
        </footer>
      </form>
    </AbsoluteWindowWrapper>
  );
};

export default ExerciseActionModal;
