import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaDumbbell, FaTrashAlt } from "react-icons/fa";
import type { ExerciseResponse } from "../../services/exerciseService";
import {
  updateTrainingPlan,
  type PlanResponse,
  type UpdateTrainingPlanProps,
} from "../../services/trainingService";
import type { ErrorResponse, GeneralResponse } from "../../types/ApiResponse";
import PlanActionModal from "./PlanActionModal";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

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
      queryClient.invalidateQueries({
        queryKey: ["trainingPlan", plan.id],
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
      toast.error(t("toastMessages.planNameRequired"));
      return;
    }

    if (planForm.planItems.length === 0) {
      toast.error(t("toastMessages.planMustHaveAtLeastOneExercise"));
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
        (element) => element.exerciseId === selectedExercise.exerciseId,
      )
    ) {
      toast.error(t("toastMessages.exerciseAlreadyAdded"));
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
    toast.success(t("toastMessages.exerciseAddedToPlan"));
  };

  return (
    <PlanActionModal
      exercises={exercises}
      handleSelectExercise={handleSelectExercise}
      title={t("updatePlan")}
      handleSubmit={handleSubmit}
      remainingFormElements={
        <div className="group relative">
          <label className="block text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-3">
            {t("planName")}
          </label>
          <input
            className="w-full bg-transparent text-3xl md:text-4xl font-bold placeholder-text-muted/30 border-0 border-b-2 border-border-light dark:border-border-dark focus:border-primary focus:outline-none focus:ring-0 px-0 pb-4 transition-colors"
            placeholder={t("planNamePlaceholder")}
            type="text"
            required
            onChange={(e) =>
              setPlanForm((prev) => ({ ...prev, planName: e.target.value }))
            }
            value={planForm["planName"]}
          />
        </div>
      }
      saveButtonText={t("update")}
      onClose={onClose}
    >
      {planForm.planItems.map((planItem) => (
        <div
          key={planItem.exerciseId}
          className="group grid grid-cols-12 gap-4 px-5 py-4 bg-surface-dark items-center transition-colors hover:bg-surface-dark/80"
        >
          <div className="col-span-8 md:col-span-9 flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-input-light dark:bg-background-dark border border-border-light dark:border-border-dark text-primary">
              <FaDumbbell className="text-xl rotate-45" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold truncate">{planItem.exerciseName}</p>
              <p className="text-xs text-text-muted mt-0.5 capitalize">
                {exercises
                  .find(
                    (exercise) => exercise.exerciseId === planItem.exerciseId,
                  )
                  ?.category?.toLowerCase() ?? ""}{" "}
              </p>
            </div>
          </div>
          <div className="col-span-3 md:col-span-2 flex justify-center">
            <div className="flex items-center bg-input-light dark:bg-background-dark rounded-lg border border-border-light dark:border-border-dark overflow-hidden">
              <button
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-300 hover:dark:bg-surface-border transition-colors text-text-muted"
                onClick={(e) => {
                  e.preventDefault();
                  setPlanForm((prev) => {
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
                          : item,
                      ),
                    };
                  });
                }}
              >
                -
              </button>
              <span className="flex justify-center items-center w-10 h-8 text-center text-sm font-medium">
                {planItem.defaultSets}
              </span>

              <button
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-300 hover:dark:bg-surface-border transition-colors text-text-muted"
                onClick={(e) => {
                  e.preventDefault();
                  setPlanForm((prev) => {
                    return {
                      ...prev,
                      planItems: prev.planItems.map((item) =>
                        item.exerciseId === planItem.exerciseId
                          ? { ...item, defaultSets: item.defaultSets + 1 }
                          : item,
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
              className="opacity-0 group-hover:opacity-100 p-0 md:p-2 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-all cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                setPlanForm((prev) => ({
                  ...prev,
                  planItems: prev.planItems.filter(
                    (item) => item.exerciseId !== planItem.exerciseId,
                  ),
                }));
              }}
            >
              <FaTrashAlt className="text-sm md:text-lg" />
            </button>
          </div>
        </div>
      ))}
    </PlanActionModal>
  );
};

export default PlanUpdateModal;
