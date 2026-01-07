import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  createNewExercise,
  EXERCISE_CATEGORIES,
  type ExerciseCategory,
  type ExerciseCreationRequest,
  type ExerciseResponse,
} from "../../services/exerciseService";
import type { ErrorResponse } from "../../types/ApiResponse";
import InputForm from "../ui/InputForm";
import ExerciseActionModal from "./ExerciseActionModal";
import Button from "../ui/Button";
import SelectOptionWindow from "../ui/SelectOptionWindow";
import { FaChevronDown } from "react-icons/fa";

interface CreateNewExerciseProps {
  onClose: () => void;
}

interface NewExerciseForm {
  exerciseName: string;
  category: ExerciseCategory;
}

const CreateNewExerciseForm = ({ onClose }: CreateNewExerciseProps) => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<NewExerciseForm>({
    exerciseName: "",
    category: "UNCATEGORIZED",
  });

  const [categorySelection, setCategorySelection] = useState<boolean>(false);

  const newExerciseMutation = useMutation<
    ExerciseResponse,
    AxiosError<ErrorResponse>,
    ExerciseCreationRequest
  >({
    mutationFn: createNewExercise,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["userExercises"] });
      toast.success(`Exercise ${response.name} created successfully.`);
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
    console.log(formData);
    if (newExerciseMutation.isPending) return;

    const newExerciseRequest: ExerciseCreationRequest = {
      name: formData.exerciseName,
      category: formData.category || "UNCATEGORIZED",
    };

    newExerciseMutation.mutate(newExerciseRequest);
  };

  return (
    <ExerciseActionModal
      title={"Create Exercise"}
      onClose={onClose}
      handleFormSubmit={handleFormSubmit}
      submitButtonTitle={"Create"}
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
        ></SelectOptionWindow>
      )}
    </ExerciseActionModal>
  );
};

export default CreateNewExerciseForm;
