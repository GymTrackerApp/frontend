import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaTimes } from "react-icons/fa";
import type { ExerciseResponse } from "../../services/exerciseService";
import {
  updateTrainingPlan,
  type PlanResponse,
  type UpdateTrainingPlanProps,
} from "../../services/trainingService";
import type { ErrorResponse, GeneralResponse } from "../../types/ApiResponse";
import InputForm from "../ui/InputForm";
import PlanActionModal from "./PlanActionModal";

interface UpdatePlanProps {
  exercises: Array<ExerciseResponse>;
  plan: PlanResponse;
  onClose: () => void;
}

interface PlanItemForm {
  exerciseId: number;
  exerciseName: string;
  defaultSets: number;
}

interface UpdatePlanForm {
  planName: string;
  planItems: Array<PlanItemForm>;
}

const PlanUpdateModal = ({ exercises, plan, onClose }: UpdatePlanProps) => {
  const [planForm, setPlanForm] = useState<UpdatePlanForm>({
    planName: plan.name,
    planItems: [...plan.planItems],
  });

  const queryClient = useQueryClient();

  const updatePlanMutation = useMutation<
    GeneralResponse,
    AxiosError<ErrorResponse>,
    UpdateTrainingPlanProps
  >({
    mutationFn: updateTrainingPlan,
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
    if (updatePlanMutation.isPending) return;

    if (!planForm.planName) {
      toast.error("Plan name is required");
      return;
    }

    if (planForm.planItems.length === 0) {
      toast.error("Plan must have at least one exercise");
      return;
    }

    const updatePlanRequest: UpdateTrainingPlanProps = {
      trainingPlanId: plan.id,
      trainingPlanUpdateRequest: {
        planName: planForm.planName,
        planItems: planForm.planItems.map((planItem) => ({
          exerciseId: planItem.exerciseId,
          defaultSets: planItem.defaultSets,
        })),
      },
    };

    updatePlanMutation.mutate(updatePlanRequest);
  };

  const handleSelectExercise = (selectedExercise: ExerciseResponse) => {
    if (
      planForm.planItems.find(
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

    const updatedPlanForm: UpdatePlanForm = {
      planName: planForm.planName,
      planItems: [...planForm.planItems, newPlanItem],
    };

    setPlanForm(updatedPlanForm);
  };

  return (
    <PlanActionModal
      exercises={exercises}
      handleSelectExercise={handleSelectExercise}
      title={"Update Plan"}
      handleSubmit={handleSubmit}
      remainingFormElements={
        <InputForm
          id={"plan-name"}
          label={"Plan Name"}
          structure="vertical"
          placeholder="e.g. Push"
          required
          onChange={(e) =>
            setPlanForm({ ...planForm, planName: e.target.value })
          }
          value={planForm["planName"]}
        />
      }
      saveButtonText={"Update"}
      onClose={onClose}
    >
      <div className="mt-3 mb-5">
        {planForm.planItems.map((planItem, planItemIndex) => (
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

                  setPlanForm((prev) => {
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
                  setPlanForm({
                    planName: planForm.planName,
                    planItems: [
                      ...planForm.planItems.filter(
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

export default PlanUpdateModal;
