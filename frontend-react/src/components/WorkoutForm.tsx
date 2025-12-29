import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  FaHistory,
  FaPlus,
  FaRegClock,
  FaStopwatch,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router";
import type {
  PlanItemResponse,
  PlanResponse,
} from "../services/trainingService";
import {
  createWorkout,
  getWorkoutExerciseHistory,
  type ExerciseSet,
  type WorkoutCreationRequest,
} from "../services/workoutService";
import type { ErrorResponse, GeneralResponse } from "../types/ApiResponse";
import AbsoluteWindowWrapper from "./AbsoluteWindowWrapper";
import AutoWorkoutTimer from "./AutoWorkoutTimer";
import WorkoutExerciseHistoryModal from "./WorkoutExerciseHistoryModal";

interface WorkoutFormProps {
  plan: PlanResponse;
}

const WorkoutForm = ({ plan }: WorkoutFormProps) => {
  const [exerciseHistory, setExerciseHistory] =
    useState<PlanItemResponse | null>(null);
  const [isFinishedWorkoutWindowOpen, setIsFinishedWorkoutWindowOpen] =
    useState<boolean>(false);

  const [workoutCreationRequest, setWorkoutCreationRequest] =
    useState<WorkoutCreationRequest>({
      trainingId: plan?.id,
      workoutItems: plan?.planItems.map((item) => ({
        exerciseId: item.exerciseId,
        type: "REPS",
        sets: Array.from({ length: item.defaultSets }, () => ({
          reps: 0,
          weight: 0,
        })),
      })),
    });

  const lastSessionResults = useQueries({
    queries: plan.planItems.map((item) => ({
      queryKey: ["lastSession", item.exerciseId],
      queryFn: () => getWorkoutExerciseHistory(item.exerciseId, 1),
    })),
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const workoutMutation = useMutation<
    GeneralResponse,
    AxiosError<ErrorResponse>,
    WorkoutCreationRequest
  >({
    mutationFn: createWorkout,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["lastSession"] });

      toast.success(response.message);
      navigate("/");
    },
    onError: (error) => {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    },
  });

  const handleUpdate = (
    exerciseIndex: number,
    setIndex: number,
    field: keyof ExerciseSet,
    newValue: string
  ) => {
    newValue = newValue.replace(",", ".");
    const numericValue = newValue === "" ? 0 : parseFloat(newValue);

    setWorkoutCreationRequest((prev) => {
      const updatedItems = [...prev.workoutItems];
      const updatedItem = { ...updatedItems[exerciseIndex] };
      const updatedSets = [...updatedItem.sets];
      updatedSets[setIndex] = {
        ...updatedSets[setIndex],
        [field]: numericValue,
      };

      updatedItem.sets = updatedSets;
      updatedItems[exerciseIndex] = updatedItem;

      return {
        ...prev,
        workoutItems: updatedItems,
      };
    });
  };

  const addSetToExercise = (exerciseIndex: number) => {
    setWorkoutCreationRequest((prev) => {
      const updatedWorkoutItems = [...prev.workoutItems];
      const updatedWorkoutItem = { ...updatedWorkoutItems[exerciseIndex] };
      const updatedSets = [...updatedWorkoutItem.sets, { reps: 0, weight: 0 }];
      updatedWorkoutItem.sets = updatedSets;
      updatedWorkoutItems[exerciseIndex] = updatedWorkoutItem;
      return {
        ...prev,
        workoutItems: updatedWorkoutItems,
      };
    });
  };

  const removeSetFromExercise = (exerciseIndex: number, setIndex: number) => {
    setWorkoutCreationRequest((prev) => {
      const updatedItems = [...prev.workoutItems];
      const updatedItem = { ...updatedItems[exerciseIndex] };
      const updatedSets = [
        ...updatedItem.sets.filter((_, index) => index !== setIndex),
      ];
      updatedItem.sets = updatedSets;
      updatedItems[exerciseIndex] = updatedItem;
      return {
        ...prev,
        workoutItems: updatedItems,
      };
    });
  };

  const handleFormSubmit = () => {
    if (workoutMutation.isPending) return;

    workoutMutation.mutate(workoutCreationRequest);
  };

  return (
    <div className="bg-gray-800 text-white min-h-dvh">
      {isFinishedWorkoutWindowOpen && (
        <AbsoluteWindowWrapper
          isOpen={true}
          onClose={() => setIsFinishedWorkoutWindowOpen(false)}
        >
          <div>
            <header className="flex justify-between items-center">
              <p className="text-xl font-bold">Finish Workout</p>
              <FaTimes
                className="cursor-pointer"
                onClick={() => setIsFinishedWorkoutWindowOpen(false)}
              />
            </header>
            <section>
              <p className="text-gray-400 text-center text-md my-4">
                What would you like to do with this workout?
              </p>
              <div className="flex gap-2">
                <button
                  className="w-full rounded-lg bg-red-500 cursor-pointer"
                  onClick={() => {
                    toast.success("Workout discarded");
                    navigate("/");
                  }}
                >
                  Discard Workout
                </button>
                <button
                  className="w-full rounded-lg bg-blue-500 cursor-pointer"
                  onClick={handleFormSubmit}
                >
                  Save Workout
                </button>
              </div>
            </section>
          </div>
        </AbsoluteWindowWrapper>
      )}

      <div className="flex justify-between items-center py-2 px-1">
        <div className="flex gap-2 justify-center items-center">
          <FaRegClock className="text-gray-400" size={22} />
          <AutoWorkoutTimer />
        </div>
        <button
          className="bg-red-400 px-2 py-1 rounded-xl cursor-pointer hover:opacity-80"
          onClick={() => setIsFinishedWorkoutWindowOpen(true)}
          type="button"
        >
          Finish Workout
        </button>
      </div>
      <button
        className="mb-2 bg-approve-button-main px-2 py-1 w-full rounded-md flex justify-center items-center gap-2 text-white font-light cursor-pointer hover:bg-hover-approve-button-main transition-colors"
        type="button"
      >
        <FaStopwatch />
        <span>Start Rest Timer</span>
      </button>

      {plan.planItems.map((planItem, exerciseIndex) => (
        <div
          key={exerciseIndex}
          className="bg-gray-700 p-2 border-b border-b-gray-700"
        >
          <div className="flex items-center mb-4 gap-2">
            <p key={planItem.exerciseId} className="text-xl">
              {planItem.exerciseName}
            </p>
            <FaHistory
              className="cursor-pointer text-gray-400"
              onClick={() => setExerciseHistory(planItem)}
            />
          </div>

          <div className="grid grid-cols-[30px_1fr_1fr_30px] gap-2 text-gray-400 text-center mb-2 px-1">
            <span className="text-xs font-bold text-gray-500 uppercase">
              Set
            </span>
            <span className="text-xs font-bold text-gray-500 uppercase">
              Weight (kg)
            </span>
            <span className="text-xs font-bold text-gray-500 uppercase">
              Reps
            </span>
            <span></span>
          </div>

          {workoutCreationRequest.workoutItems[exerciseIndex].sets.map(
            (_, setIndex) => {
              let repsPlaceholder = "0";
              let weightPlaceholder = "0";

              if (lastSessionResults[exerciseIndex].isLoading) {
                repsPlaceholder = "...";
                weightPlaceholder = "...";
              } else if (
                lastSessionResults[exerciseIndex].data?.history?.[0]?.sets?.[
                  setIndex
                ]
              ) {
                const prevSet =
                  lastSessionResults[exerciseIndex].data.history[0].sets[
                    setIndex
                  ];
                repsPlaceholder = prevSet.reps.toString();
                weightPlaceholder = prevSet.weight.toString();
              }

              return (
                <div
                  key={setIndex}
                  className="grid grid-cols-[30px_1fr_1fr_30px] gap-2 items-center"
                >
                  <span className="text-center text-gray-400">
                    {setIndex + 1}
                  </span>
                  <input
                    className="bg-gray-800 border border-gray-700 text-center py-2 px-1 rounded-lg
    focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 no-spinner"
                    type="number"
                    step="any"
                    inputMode="decimal"
                    min={0}
                    placeholder={String(weightPlaceholder)}
                    value={
                      workoutCreationRequest.workoutItems[exerciseIndex].sets[
                        setIndex
                      ].weight === 0
                        ? ""
                        : workoutCreationRequest.workoutItems[exerciseIndex]
                            .sets[setIndex].weight
                    }
                    onChange={(e) =>
                      handleUpdate(
                        exerciseIndex,
                        setIndex,
                        "weight",
                        e.target.value
                      )
                    }
                  />
                  <input
                    className="bg-gray-800 border border-gray-700 text-center py-2 px-1 rounded-lg
    focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 no-spinner"
                    type="number"
                    placeholder={String(repsPlaceholder)}
                    step="1"
                    value={
                      workoutCreationRequest.workoutItems[exerciseIndex].sets[
                        setIndex
                      ].reps === 0
                        ? ""
                        : workoutCreationRequest.workoutItems[exerciseIndex]
                            .sets[setIndex].reps
                    }
                    min={1}
                    onChange={(e) =>
                      handleUpdate(
                        exerciseIndex,
                        setIndex,
                        "reps",
                        e.target.value
                      )
                    }
                    onKeyDown={(e) => {
                      if (e.key === "." || e.key === "," || e.key === "e") {
                        e.preventDefault();
                      }
                    }}
                  />
                  <FaTimes
                    className="hover:opacity-80 cursor-pointer"
                    color="red"
                    onClick={() =>
                      removeSetFromExercise(exerciseIndex, setIndex)
                    }
                  />
                </div>
              );
            }
          )}

          <button
            className="w-full flex justify-center items-center border border-blue-500 rounded-xl text-blue-500 gap-2 mt-2 hover:border-blue-400 hover:text-blue-400 cursor-pointer"
            type="button"
            onClick={() => addSetToExercise(exerciseIndex)}
          >
            <FaPlus />
            <span>Add Set</span>
          </button>
        </div>
      ))}
      {exerciseHistory && (
        <WorkoutExerciseHistoryModal
          planItem={exerciseHistory}
          onClose={() => setExerciseHistory(null)}
        />
      )}
    </div>
  );
};

export default WorkoutForm;
