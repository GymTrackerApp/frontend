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
import InputForm from "../ui/InputForm";
import PlanActionModal from "./PlanActionModal";

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

const PlanCreationModal = ({ exercises, onClose }: NewPlanProps) => {
  const [newPlanForm, setNewPlanForm] = useState<NewPlanForm>({
    planName: "",
    planItems: [],
  });

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

    if (!newPlanForm.planName) {
      toast.error("Plan name is required");
      return;
    }

    if (newPlanForm.planItems.length === 0) {
      toast.error("Plan must have at least one exercise");
      return;
    }

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
    <PlanActionModal
      exercises={exercises}
      handleSelectExercise={handleSelectExercise}
      title={"Create New Plan"}
      handleSubmit={handleSubmit}
      remainingFormElements={
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
      }
      saveButtonText={"Create"}
      onClose={onClose}
    >
      <div className="mt-3 mb-5">
        {newPlanForm.planItems.map((planItem, planItemIndex) => (
          <div key={planItem.exerciseId} className="flex justify-between">
            <div className="flex w-3/4 gap-3">
              <span className="flex justify-center items-center w-1/6 max-w-9 bg-gray-600 text-gray-300 text-sm">
                {planItemIndex + 1}
              </span>
              <span className="flex items-center w-5/6">
                {planItem.exerciseName}
              </span>
            </div>

            <div className="flex justify-end items-center w-3/4">
              <input
                className="w-3/4 h-3/4 max-w-40 py-2 text-center bg-gray-700 text-white border border-gray-500 rounded-xl no-spinner focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
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
              <span className="text-gray-400 text-sm my-auto mx-2 w-1/6">
                sets
              </span>
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
          </div>
        ))}
      </div>
    </PlanActionModal>
  );
};

export default PlanCreationModal;
