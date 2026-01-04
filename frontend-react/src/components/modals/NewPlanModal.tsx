import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaTimes } from "react-icons/fa";
import type { ExerciseResponse } from "../../services/exerciseService";
import {
  createUserPlan,
  type PlanItemRequest,
  type PlanRequest,
} from "../../services/trainingService";
import type { ErrorResponse, GeneralResponse } from "../../types/ApiResponse";
import ExitApproveActionButtons from "../ExitApproveActionButtons";
import InputForm from "../InputForm";
import SelectOptionWindow from "../ui/SelectOptionWindow";
import AbsoluteWindowWrapper from "../ui/AbsoluteWindowWrapper";

interface NewPlanProps {
  exercises: Array<ExerciseResponse>;
  onClose: () => void;
}

interface PlanItemForm {
  exerciseId: number;
  exerciseName: string;
  defaultSets: number;
}

interface NewPlanForm {
  planName: string;
  planItems: Array<PlanItemForm>;
}

const NewPlanModal = ({ exercises, onClose }: NewPlanProps) => {
  const [newPlanForm, setNewPlanForm] = useState<NewPlanForm>({
    planName: "",
    planItems: [],
  });

  const [addExerciseEnabled, setAddExerciseEnabled] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const newPlanMutation = useMutation<
    GeneralResponse,
    AxiosError<ErrorResponse>,
    PlanRequest
  >({
    mutationFn: createUserPlan,
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["userPlans"],
      });
      toast.success(response.message);
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

  const handleSubmit = () => {
    if (newPlanMutation.isPending) return;

    const newPlanRequest: PlanRequest = {
      planName: newPlanForm.planName,
      planItems: newPlanForm.planItems.map((planItem) => {
        const planItemRequest: PlanItemRequest = {
          exerciseId: planItem.exerciseId,
          defaultSets: planItem.defaultSets,
        };
        return planItemRequest;
      }),
    };

    newPlanMutation.mutate(newPlanRequest);
  };

  const handleSelectExercise = (selectedExercise: ExerciseResponse) => {
    setAddExerciseEnabled(false);

    if (
      newPlanForm.planItems.find(
        (element) => element.exerciseId === selectedExercise.exerciseId
      )
    ) {
      toast.error("This element was already added");
      return;
    }

    const newPlanItem: PlanItemForm = {
      exerciseId: selectedExercise.exerciseId,
      exerciseName: selectedExercise.name,
      defaultSets: 1,
    };

    const updatedPlanForm: NewPlanForm = {
      planName: newPlanForm.planName,
      planItems: [...newPlanForm.planItems, newPlanItem],
    };

    setNewPlanForm(updatedPlanForm);
  };

  return (
    <AbsoluteWindowWrapper isOpen={true} onClose={onClose}>
      <form
        className="w-full"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <h1 className="text-2xl font-bold">Create New Plan</h1>

        <InputForm
          id={"plan-name"}
          label={"Plan Name"}
          structure="vertical"
          placeholder="e.g. Push"
          required
          onChange={(e) =>
            setNewPlanForm({ ...newPlanForm, planName: e.target.value })
          }
        />

        <div className="flex justify-between items-center px-2 mb-3">
          <p className="font-bold">Exercises</p>
          <button
            className="px-3 border rounded-md text-sm cursor-pointer"
            onClick={() => setAddExerciseEnabled(true)}
            type="button"
          >
            Add Exercise
          </button>
        </div>

        <div className="my-5">
          {newPlanForm.planItems.map((planItem) => (
            <div key={planItem.exerciseId} className="flex px-2">
              <span className="w-full">{planItem.exerciseName}</span>
              <input
                className="w-full text-center bg-gray-700 text-white border border-gray-500 rounded-xl no-spinner focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
                type="number"
                min={1}
                value={String(planItem.defaultSets)}
                onChange={(e) => {
                  const val = e.target.value;
                  const numericValue = val === "" ? 1 : parseInt(val, 10);

                  setNewPlanForm((prev) => {
                    return {
                      ...prev,
                      planItems: prev.planItems.map((item) =>
                        item.exerciseId === planItem.exerciseId
                          ? { ...item, defaultSets: numericValue }
                          : item
                      ),
                    };
                  });
                }}
              />
              <span className="text-gray-400 text-sm my-auto mx-2">sets</span>
              <button
                className="text-red-400 cursor-pointer hover:opacity-80"
                type="button"
                onClick={() =>
                  setNewPlanForm({
                    planName: newPlanForm.planName,
                    planItems: [
                      ...newPlanForm.planItems.filter(
                        (item) => item.exerciseId !== planItem.exerciseId
                      ),
                    ],
                  })
                }
              >
                <FaTimes />
              </button>
            </div>
          ))}
        </div>

        {addExerciseEnabled && (
          <SelectOptionWindow
            title={"Select Exercise"}
            onClose={() => setAddExerciseEnabled(false)}
            data={exercises}
            renderItem={(exercise) => (
              <p key={exercise.exerciseId} className="flex flex-col">
                <span>{exercise.name}</span>
                <span className="text-gray-400 text-sm">
                  {exercise.category.charAt(0) +
                    exercise.category.substring(1).toLowerCase()}
                </span>
              </p>
            )}
            onSelect={handleSelectExercise}
          />
        )}

        <ExitApproveActionButtons onCancel={onClose} />
      </form>
    </AbsoluteWindowWrapper>
  );
};

export default NewPlanModal;
