import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  EXERCISE_CATEGORIES,
  updateExercise,
  type ExerciseResponse,
  type UpdateExerciseProps,
} from "../../services/exerciseService";
import type { ErrorResponse } from "../../types/ApiResponse";
import InputForm from "../ui/InputForm";
import ExerciseActionModal from "./ExerciseActionModal";
import Button from "../ui/Button";
import { FaChevronDown } from "react-icons/fa";
import SelectOptionWindow from "../ui/SelectOptionWindow";

interface ExerciseUpdateProps {
  onClose: () => void;
  exercise: ExerciseResponse;
}

interface ExerciseUpdateForm {
  exerciseName: string;
  category: string;
}

const ExerciseUpdateModal = ({ onClose, exercise }: ExerciseUpdateProps) => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<ExerciseUpdateForm>({
    exerciseName: exercise.name,
    category: exercise.category,
  });

  const [categorySelection, setCategorySelection] = useState<boolean>(false);

  const exerciseUpdateMutation = useMutation<
    ExerciseResponse,
    AxiosError<ErrorResponse>,
    UpdateExerciseProps
  >({
    mutationFn: updateExercise,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["userExercises"] });
      toast.success(`Exercise ${response.name} updated successfully.`);
      onClose();
    },
    onError: (error) => {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    },
  });

  const handleFormUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (exerciseUpdateMutation.isPending) return;

    if (!formData.exerciseName.trim()) {
      toast.error("Exercise name is required");
      return;
    }

    const exerciseUpdateRequest: UpdateExerciseProps = {
      exerciseId: exercise.exerciseId,
      request: {
        name: formData.exerciseName,
        category: formData.category || "UNCATEGORIZED",
      },
    };

    exerciseUpdateMutation.mutate(exerciseUpdateRequest);
  };

  return (
    <ExerciseActionModal
      title={"Update Exercise"}
      onClose={onClose}
      handleFormSubmit={handleFormSubmit}
      submitButtonTitle={"Update"}
    >
      <InputForm
        id={"exercise-name"}
        name="exerciseName"
        label={"Exercise Name"}
        structure="vertical"
        placeholder="e.g. Benchpress"
        onChange={handleFormUpdate}
        value={formData["exerciseName"]}
        required
      />
      <p className="mx-0 font-semibold mb-2">Exercise Category</p>
      <Button
        btnStyle={"options"}
        size={"small"}
        additionalStyle="rounded-lg mx-0 mb-4"
        onClick={(e) => {
          e.preventDefault();
          setCategorySelection(true);
        }}
      >
        <span className="capitalize">
          {formData["category"] === "UNCATEGORIZED"
            ? "Select Category"
            : formData["category"].toLowerCase()}
        </span>
        <FaChevronDown />
      </Button>
      {categorySelection && (
        <SelectOptionWindow
          title={"Select Category"}
          onClose={() => setCategorySelection(false)}
          data={EXERCISE_CATEGORIES}
          onSelect={(item) => {
            setFormData((prev) => ({
              ...prev,
              category: item,
            }));
            setCategorySelection(false);
          }}
          renderItem={(category) => (
            <p className="capitalize">{category.toLowerCase()}</p>
          )}
          dataFilter={(data, keyword) =>
            data.filter((exerciseCategory) =>
              exerciseCategory.toLowerCase().includes(keyword.toLowerCase())
            )
          }
        />
      )}
    </ExerciseActionModal>
  );
};

export default ExerciseUpdateModal;
