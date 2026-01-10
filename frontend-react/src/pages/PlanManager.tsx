import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaPlus, FaRegEdit, FaTrashAlt } from "react-icons/fa";
import FetchHandler from "../components/FetchHandler";
import Header from "../components/Header";
import NewExerciseModal from "../components/modals/ExerciseCreationModal";
import ExerciseUpdateModal from "../components/modals/ExerciseUpdateModal";
import PlanCreationModal from "../components/modals/PlanCreationModal";
import Plan from "../components/Plan";
import PlanManagerToggleTabs from "../components/PlanManagerToggleTabs";
import Button from "../components/ui/Button";
import { useAvailableExercises } from "../hooks/useWorkoutFlow";
import {
  getUserExercises,
  removeExercise,
  type ExerciseResponse,
} from "../services/exerciseService";
import {
  getPredefinedPlans,
  getUserPlans,
  type PlanResponse,
} from "../services/trainingService";
import type { ErrorResponse, GeneralResponse } from "../types/ApiResponse";

const PlanManager = () => {
  const [newPlanModalEnabled, setNewPlanModalEnabled] =
    useState<boolean>(false);
  const [newExerciseModalEnabled, setNewExerciseModalEnabled] =
    useState<boolean>(false);
  const [updateExercise, setUpdateExercise] = useState<ExerciseResponse | null>(
    null
  );

  const [isMyPlansEnabled, setIsMyPlansEnabled] = useState<boolean>(true);
  const [isPredefinedPlansEnabled, setIsPredefinedPlansEnabled] =
    useState<boolean>(false);
  const [isMyExercisesEnabled, setIsMyExercisesEnabled] =
    useState<boolean>(false);

  const queryClient = useQueryClient();

  const {
    data: myExercises,
    isLoading: isMyExercisesLoading,
    isError: isMyExercisesError,
  } = useQuery<Array<ExerciseResponse>, ErrorResponse>({
    queryFn: getUserExercises,
    queryKey: ["userExercises"],
  });

  const {
    data: predefinedPlans,
    isLoading: isPredefinedPlansLoading,
    isError: isPredefinedPlansError,
  } = useQuery<Array<PlanResponse>, ErrorResponse>({
    queryFn: getPredefinedPlans,
    queryKey: ["predefinedPlans"],
  });

  const {
    data: myPlans,
    isLoading: isMyPlansLoading,
    isError: isMyPlansError,
  } = useQuery<Array<PlanResponse>, ErrorResponse>({
    queryFn: getUserPlans,
    queryKey: ["userPlans"],
  });

  const { exercises: allUserAvailableExercises } = useAvailableExercises();

  const exerciseRemoveMutation = useMutation<
    GeneralResponse,
    AxiosError<ErrorResponse>,
    number
  >({
    mutationFn: removeExercise,
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["userExercises"] });
    },
    onError: (error) => {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    },
  });

  const handleRemoveExercise = (exerciseId: number) => {
    if (exerciseRemoveMutation.isPending) return;

    exerciseRemoveMutation.mutate(exerciseId);
  };

  return (
    <>
      <Header />
      <div className="bg-gray-800 text-white p-3 min-h-dvh">
        <h1 className="text-3xl font-bold">Plan Manager</h1>
        <p className="text-gray-400 mb-3">
          Create and manage your training plans
        </p>
        <div>
          <PlanManagerToggleTabs
            isMyPlansEnabled={isMyPlansEnabled}
            isPredefinedPlansEnabled={isPredefinedPlansEnabled}
            isMyExercisesEnabled={isMyExercisesEnabled}
            setIsMyPlansEnabled={setIsMyPlansEnabled}
            setIsPredefinedPlansEnabled={setIsPredefinedPlansEnabled}
            setIsMyExercisesEnabled={setIsMyExercisesEnabled}
          />

          {/* My Plans */}

          {isMyPlansEnabled && (
            <Button
              btnStyle={"approve"}
              size="small"
              additionalStyle="rounded-md"
              onClick={() => setNewPlanModalEnabled(true)}
            >
              <FaPlus />
              <span>Create New Plan</span>
            </Button>
          )}

          {newPlanModalEnabled && (
            <PlanCreationModal
              exercises={allUserAvailableExercises}
              onClose={() => setNewPlanModalEnabled(false)}
            />
          )}

          <FetchHandler
            isEnabled={isMyPlansEnabled}
            isLoading={isMyPlansLoading}
            isError={isMyPlansError}
            data={myPlans}
            emptyMessage={"You currently don't have any plans."}
          >
            {(data: Array<PlanResponse>) =>
              data.map((plan) => (
                <Plan
                  key={plan.id}
                  plan={plan}
                  updatable={true}
                  removable={true}
                  exercises={allUserAvailableExercises}
                />
              ))
            }
          </FetchHandler>

          {/* My Exercises */}

          {isMyExercisesEnabled && (
            <Button
              btnStyle={"approve"}
              size={"small"}
              additionalStyle="rounded-md"
              onClick={() => setNewExerciseModalEnabled(true)}
            >
              <FaPlus />
              <span>Create New Exercise</span>
            </Button>
          )}

          {newExerciseModalEnabled && (
            <NewExerciseModal
              onClose={() => setNewExerciseModalEnabled(false)}
            />
          )}

          <FetchHandler
            isEnabled={isMyExercisesEnabled}
            isLoading={isMyExercisesLoading}
            isError={isMyExercisesError}
            data={myExercises}
            emptyMessage={"You currently don't have any exercises."}
          >
            {(data: Array<ExerciseResponse>) =>
              data.map((ex) => (
                <p
                  key={ex.exerciseId}
                  className="flex flex-col bg-gray-700 rounded-xl my-3 px-3 py-1"
                >
                  <span className="flex justify-between items-center">
                    <span>{ex.name}</span>
                    <span className="flex gap-3 items-center">
                      <FaRegEdit
                        size={15}
                        className="cursor-pointer hover:opacity-80"
                        onClick={() => setUpdateExercise(ex)}
                      />
                      <FaTrashAlt
                        color="red"
                        size={15}
                        className="cursor-pointer hover:opacity-80"
                        onClick={() => handleRemoveExercise(ex.exerciseId)}
                      />
                    </span>
                  </span>
                  <span className="text-gray-400 text-sm">{ex.category}</span>
                </p>
              ))
            }
          </FetchHandler>

          {updateExercise && (
            <ExerciseUpdateModal
              onClose={() => setUpdateExercise(null)}
              exercise={updateExercise}
            />
          )}

          {/* Predefined Plans */}

          <FetchHandler
            isEnabled={isPredefinedPlansEnabled}
            isLoading={isPredefinedPlansLoading}
            isError={isPredefinedPlansError}
            data={predefinedPlans}
            emptyMessage={"There are currently no predefined plans."}
          >
            {(data: Array<PlanResponse>) =>
              data.map((plan: PlanResponse) => (
                <Plan
                  key={plan.id}
                  plan={plan}
                  updatable={false}
                  removable={false}
                  exercises={[]}
                />
              ))
            }
          </FetchHandler>
        </div>
      </div>
    </>
  );
};

export default PlanManager;
