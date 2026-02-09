import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import CreateNewResource from "../components/CreateNewResource";
import Exercise from "../components/Exercise";
import ExerciseLoading from "../components/loaders/ExerciseLoading";
import NewExerciseModal from "../components/modals/ExerciseCreationModal";
import ExerciseUpdateModal from "../components/modals/ExerciseUpdateModal";
import PlanCreationModal from "../components/modals/PlanCreationModal";
import PageWrapper from "../components/ui/PageWrapper";
import Plan from "../components/Plan";
import PlanLoading from "../components/loaders/PlanLoading";
import PlanManagerToggleTabs from "../components/PlanManagerToggleTabs";
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
import LoadingFailed from "../components/ui/LoadingFailed";

const PlanManager = () => {
  const [newPlanModalEnabled, setNewPlanModalEnabled] =
    useState<boolean>(false);
  const [newExerciseModalEnabled, setNewExerciseModalEnabled] =
    useState<boolean>(false);
  const [updateExercise, setUpdateExercise] = useState<ExerciseResponse | null>(
    null,
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

  const handleRemoveExercise = (exerciseId: number) => {
    if (exerciseRemoveMutation.isPending) return;

    exerciseRemoveMutation.mutate(exerciseId);
  };

  return (
    <PageWrapper>
      <div className="w-full max-w-300 mx-auto px-6 py-8 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-black tracking-tight">Plan Manager</h1>
            <p className="text-gray-500 text-base font-normal max-w-lg">
              Manage your workout routines, customize schedules, and track your
              exercise library
            </p>
          </div>

          {isMyPlansEnabled && (
            <button
              className="flex cursor-pointer items-center justify-center rounded-lg h-11 px-5 bg-primary hover:bg-blue-600 text-white gap-2 text-sm font-bold shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all transform active:scale-95"
              onClick={() => setNewPlanModalEnabled(true)}
            >
              <FaPlus size={20} />
              <span>Create New Plan</span>
            </button>
          )}

          {isMyExercisesEnabled && (
            <button
              className="flex cursor-pointer items-center justify-center rounded-lg h-11 px-5 bg-primary hover:bg-blue-600 text-white gap-2 text-sm font-bold shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all transform active:scale-95"
              onClick={() => setNewExerciseModalEnabled(true)}
            >
              <FaPlus size={20} />
              <span>Create New Exercise</span>
            </button>
          )}
        </div>

        <PlanManagerToggleTabs
          isMyPlansEnabled={isMyPlansEnabled}
          isPredefinedPlansEnabled={isPredefinedPlansEnabled}
          isMyExercisesEnabled={isMyExercisesEnabled}
          setIsMyPlansEnabled={setIsMyPlansEnabled}
          setIsPredefinedPlansEnabled={setIsPredefinedPlansEnabled}
          setIsMyExercisesEnabled={setIsMyExercisesEnabled}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
          {/* My Plans */}

          {newPlanModalEnabled && (
            <PlanCreationModal
              exercises={allUserAvailableExercises}
              onClose={() => setNewPlanModalEnabled(false)}
            />
          )}

          {isMyPlansEnabled && (
            <>
              {isMyPlansLoading ? (
                <PlanLoading />
              ) : isMyPlansError || !myPlans ? (
                <LoadingFailed message="Failed to load plans" />
              ) : (
                <>
                  {myPlans.map((plan) => (
                    <Plan
                      key={plan.id}
                      plan={plan}
                      updatable={true}
                      removable={true}
                      exercises={allUserAvailableExercises}
                    />
                  ))}
                  <CreateNewResource
                    creationText={"Create Custom Plan"}
                    descriptionText="Design a new routine from scratch tailored to your goals"
                    onNewResourceCreated={() => setNewPlanModalEnabled(true)}
                  />
                </>
              )}
            </>
          )}

          {/* My Exercises */}

          {newExerciseModalEnabled && (
            <NewExerciseModal
              onClose={() => setNewExerciseModalEnabled(false)}
            />
          )}

          {isMyExercisesEnabled && (
            <>
              {isMyExercisesLoading ? (
                <ExerciseLoading />
              ) : isMyExercisesError || !myExercises ? (
                <LoadingFailed message="Failed to load exercises" />
              ) : (
                <>
                  {myExercises.map((exercise) => (
                    <Exercise
                      key={exercise.exerciseId}
                      exercise={exercise}
                      setUpdateExercise={setUpdateExercise}
                      handleRemoveExercise={handleRemoveExercise}
                    />
                  ))}
                  <CreateNewResource
                    creationText={"Create New Exercise"}
                    descriptionText="Expand your library with custom exercises"
                    onNewResourceCreated={() =>
                      setNewExerciseModalEnabled(true)
                    }
                  />
                </>
              )}
            </>
          )}

          {updateExercise && (
            <ExerciseUpdateModal
              onClose={() => setUpdateExercise(null)}
              exercise={updateExercise}
            />
          )}

          {/* Predefined Plans */}

          {isPredefinedPlansEnabled && (
            <>
              {isPredefinedPlansLoading ? (
                <PlanLoading />
              ) : isPredefinedPlansError || !predefinedPlans ? (
                <LoadingFailed message="Failed to load predefined plans" />
              ) : (
                predefinedPlans.map((plan) => (
                  <Plan
                    key={plan.id}
                    plan={plan}
                    updatable={false}
                    removable={false}
                    exercises={allUserAvailableExercises}
                  />
                ))
              )}
            </>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default PlanManager;
