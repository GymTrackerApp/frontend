import AbsoluteWindowWrapper from "../ui/AbsoluteWindowWrapper";
import Button from "../ui/Button";

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
    <AbsoluteWindowWrapper isOpen={true} onClose={onClose} windowSize="large">
      <form className="w-full">
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        {children}
        <div className="flex gap-2 mt-2">
          <Button
            btnStyle={"cancel"}
            size={"medium"}
            additionalStyle="rounded-xl w-full text-sm"
            onClick={(e) => {
              e.preventDefault();
              onClose();
            }}
          >
            <span>Cancel</span>
          </Button>
          <Button
            btnStyle={"approve"}
            size={"medium"}
            additionalStyle="rounded-xl w-full text-sm"
            onClick={handleFormSubmit}
            type="submit"
          >
            <span>{submitButtonTitle}</span>
          </Button>
        </div>
      </form>
    </AbsoluteWindowWrapper>
  );
};

export default ExerciseActionModal;
