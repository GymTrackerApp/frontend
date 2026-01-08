import {
  FaChevronDown,
  FaChevronUp,
  FaRegEdit,
  FaTrashAlt,
} from "react-icons/fa";
import {
  removeTrainingPlan,
  type PlanResponse,
} from "../services/trainingService";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ErrorResponse, GeneralResponse } from "../types/ApiResponse";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import PlanUpdateModal from "./modals/PlanUpdateModal";
import type { ExerciseResponse } from "../services/exerciseService";

interface PlanProps {
  plan: PlanResponse;
  exercises: Array<ExerciseResponse>;
  updatable: boolean;
  removable: boolean;
}

const Plan = ({
  plan,
  exercises,
  updatable,
  removable: removeable,
}: PlanProps) => {
  const queryClient = useQueryClient();

  const [isPlanExpanded, setIsPlanExpanded] = useState<boolean>(false);
  const [updatePlan, setUpdatePlan] = useState<PlanResponse | null>(null);

  const planRemoveMutation = useMutation<
    GeneralResponse,
    AxiosError<ErrorResponse>,
    number
  >({
    mutationFn: removeTrainingPlan,
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["userPlans"] });
    },
    onError: (error) => {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    },
  });

  const handleRemovePlan = () => {
    if (planRemoveMutation.isPending) return;

    planRemoveMutation.mutate(plan.id);
  };

  return (
    <>
      <p
        className="bg-gray-700 px-3 py-2 rounded-xl my-3 cursor-pointer hover:bg-gray-600 transition-colors"
        onClick={() => setIsPlanExpanded(!isPlanExpanded)}
      >
        <span className="flex justify-between">
          {plan.name}{" "}
          <span className="flex gap-2">
            {updatable && (
              <FaRegEdit
                className="cursor-pointer hover:opacity-80"
                onClick={(e) => {
                  e.stopPropagation();
                  setUpdatePlan(plan);
                }}
              />
            )}
            {removeable && (
              <FaTrashAlt
                color="red"
                className="cursor-pointer hover:opacity-80"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemovePlan();
                }}
              />
            )}
            {isPlanExpanded ? (
              <FaChevronUp size={12} />
            ) : (
              <FaChevronDown size={12} />
            )}
          </span>
        </span>
        <span className="text-gray-400">
          {plan.planItems.length}{" "}
          {plan.planItems.length === 1 ? "exercise" : "exercises"}
        </span>
      </p>

      {isPlanExpanded && (
        <ul className="px-1">
          {plan.planItems.map((planItem, planItemIndex) => (
            <li key={planItem.exerciseId} className="flex justify-between">
              <div className="flex gap-2">
                <span className="flex justify-center items-center min-w-8 max-w-9 bg-gray-600 text-gray-300 text-sm py-1">
                  {planItemIndex + 1}
                </span>
                <span className="flex justify-center items-center">
                  {planItem.exerciseName}
                </span>
              </div>
              <span className="flex justify-center items-center text-gray-400">
                {planItem.defaultSets}{" "}
                {planItem.defaultSets === 1 ? "set" : "sets"}
              </span>
            </li>
          ))}
        </ul>
      )}

      {updatePlan && (
        <PlanUpdateModal
          exercises={exercises}
          plan={plan}
          onClose={() => setUpdatePlan(null)}
        />
      )}
    </>
  );
};

export default Plan;
