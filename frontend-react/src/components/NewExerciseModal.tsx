import { useMutation, useQueryClient } from "@tanstack/react-query";
import InputForm from "./InputForm";
import type { AxiosError } from "axios";
import {
  createNewExercise,
  type ExerciseResponse,
  type NewExerciseRequest,
} from "../services/exerciseService";
import toast from "react-hot-toast";
import type { ErrorResponse } from "../types/ApiResponse";
import { useState } from "react";
import { useNavigate } from "react-router";
import AbsoluteWindowWrapper from "./AbsoluteWindowWrapper";

interface CreateNewExerciseProps {
  onClose: () => void;
}

interface NewExerciseForm {
  exerciseName: string;
  category: string;
}

const CreateNewExerciseForm = ({ onClose }: CreateNewExerciseProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<NewExerciseForm>({
    exerciseName: "",
    category: "",
  });

  const newExerciseMutation = useMutation<
    ExerciseResponse,
    AxiosError<ErrorResponse>,
    NewExerciseRequest
  >({
    mutationFn: createNewExercise,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["userExercises"] });
      toast.success(`Exercise ${response.name} created successfully.`);
      onClose();
    },
    onError: (error) => {
      if (error.status === 401) {
        navigate("/register-login", { replace: true });
        toast.error("Please log in to create a new exercise.");
        return;
      }

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
    if (newExerciseMutation.isPending) return;

    const newExerciseRequest: NewExerciseRequest = {
      name: formData.exerciseName,
      category: formData.category || "UNCATEGORIZED",
    };

    newExerciseMutation.mutate(newExerciseRequest);
  };

  return (
    <AbsoluteWindowWrapper isOpen={true} onClose={onClose}>
      <form className="w-full">
        <h1 className="text-2xl font-bold mb-2">Create New Exercise</h1>
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
        <InputForm
          id={"category"}
          name="category"
          label={"Category (Optional)"}
          structure="vertical"
          placeholder="e.g. Legs"
          onChange={handleFormUpdate}
          value={formData["category"]}
        />
        <div className="flex gap-2 mt-2">
          <button
            className="px-3 w-full border-blue-500 border-2 rounded-2xl cursor-pointer text-blue-400"
            onClick={(e: React.FormEvent) => {
              e.preventDefault();
              onClose();
            }}
          >
            Cancel
          </button>
          <button
            className="px-3 w-full border-blue-500 border-2 rounded-2xl cursor-pointer bg-approve-button-main disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleFormSubmit}
            type="submit"
            disabled={!formData.exerciseName.trim()}
          >
            Create Exercise
          </button>
        </div>
      </form>
    </AbsoluteWindowWrapper>
  );
};

export default CreateNewExerciseForm;
