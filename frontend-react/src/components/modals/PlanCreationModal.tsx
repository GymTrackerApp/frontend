import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaDumbbell, FaTrashAlt } from "react-icons/fa";
import type { ExerciseResponse } from "../../services/exerciseService";
import {
  createUserPlan,
  type PlanItemRequest,
  type PlanRequest,
} from "../../services/trainingService";
import type { ErrorResponse, GeneralResponse } from "../../types/ApiResponse";
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
      toast.error("This exercise was already added");
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
    toast.success("Exercise added to plan");
  };

  return (
    <PlanActionModal
      exercises={exercises}
      handleSelectExercise={handleSelectExercise}
      title={"Create New Plan"}
      handleSubmit={handleSubmit}
      remainingFormElements={
        <div className="group relative">
          <label className="block text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-3">
            Plan Name
          </label>
          <input
            className="w-full bg-transparent text-3xl md:text-4xl font-bold text-white placeholder-text-muted/30 border-0 border-b-2 border-surface-border focus:border-primary focus:outline-none focus:ring-0 px-0 pb-4 transition-colors"
            placeholder="e.g. Push"
            type="text"
            required
            onChange={(e) =>
              setNewPlanForm({ ...newPlanForm, planName: e.target.value })
            }
          />
        </div>
      }
      saveButtonText={"Create"}
      onClose={onClose}
    >
      {newPlanForm.planItems.map((planItem) => (
        <div
          key={planItem.exerciseId}
          className="group grid grid-cols-12 gap-4 px-5 py-4 bg-surface-dark items-center transition-colors hover:bg-surface-dark/80"
        >
          <div className="col-span-8 md:col-span-9 flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background-dark border border-surface-border text-primary">
              <FaDumbbell className="text-xl rotate-45" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-white truncate">
                {planItem.exerciseName}
              </p>
              <p className="text-xs text-text-muted mt-0.5 capitalize">
                {exercises
                  .find(
                    (exercise) => exercise.exerciseId === planItem.exerciseId
                  )
                  ?.category?.toLowerCase() ?? ""}{" "}
              </p>
            </div>
          </div>
          <div className="col-span-3 md:col-span-2 flex justify-center">
            <div className="flex items-center bg-background-dark rounded-lg border border-surface-border overflow-hidden">
              <button
                type="button"
                className="w-8 h-8 flex items-center justify-center hover:bg-surface-border transition-colors text-text-muted"
                onClick={(e) => {
                  e.preventDefault();
                  setNewPlanForm((prev) => {
                    return {
                      ...prev,
                      planItems: prev.planItems.map((item) =>
                        item.exerciseId === planItem.exerciseId
                          ? {
                              ...item,
                              defaultSets:
                                item.defaultSets - 1 <= 0
                                  ? item.defaultSets
                                  : item.defaultSets - 1,
                            }
                          : item
                      ),
                    };
                  });
                }}
              >
                -
              </button>
              <span className="flex justify-center items-center w-10 h-8 text-center text-white text-sm font-medium">
                {planItem.defaultSets}
              </span>

              <button
                type="button"
                className="w-8 h-8 flex items-center justify-center hover:bg-surface-border transition-colors text-text-muted"
                onClick={(e) => {
                  e.preventDefault();
                  setNewPlanForm((prev) => {
                    return {
                      ...prev,
                      planItems: prev.planItems.map((item) =>
                        item.exerciseId === planItem.exerciseId
                          ? { ...item, defaultSets: item.defaultSets + 1 }
                          : item
                      ),
                    };
                  });
                }}
              >
                +
              </button>
            </div>
          </div>
          <div className="col-span-1 flex justify-center">
            <button
              type="button"
              className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-0 md:p-2 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-all cursor-pointer"
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
              <FaTrashAlt
                className="text-sm md:text-lg"
                onClick={(e) => {
                  e.preventDefault();
                }}
              />
            </button>
          </div>
        </div>
      ))}
    </PlanActionModal>
  );
};

export default PlanCreationModal;
