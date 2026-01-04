import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  FaCheck,
  FaHistory,
  FaPlus,
  FaRegClock,
  FaStopwatch,
  FaSync,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router";
import { useAvailableExercises } from "../hooks/useWorkoutFlow";
import type { ExerciseResponse } from "../services/exerciseService";
import type {
  PlanItemResponse,
  PlanResponse,
} from "../services/trainingService";
import {
  createWorkout,
  getWorkoutExerciseHistory,
  getWorkouts,
  type ExerciseSet,
  type WorkoutCreationRequest,
} from "../services/workoutService";
import type { ErrorResponse, GeneralResponse } from "../types/ApiResponse";
import AutoWorkoutTimer from "./AutoWorkoutTimer";
import WorkoutDetails from "./modals/WorkoutDetailsModal";
import WorkoutExerciseHistoryModal from "./modals/WorkoutExerciseHistoryModal";
import RestTimer from "./RestTimer";
import AbsoluteWindowWrapper from "./ui/AbsoluteWindowWrapper";
import SelectOptionWindow from "./ui/SelectOptionWindow";

interface WorkoutFormProps {
  plan: PlanResponse;
}

const WorkoutForm = ({ plan }: WorkoutFormProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [exerciseHistory, setExerciseHistory] =
    useState<PlanItemResponse | null>(null);
  const [isFinishedWorkoutWindowOpen, setIsFinishedWorkoutWindowOpen] =
    useState<boolean>(false);
  const [replacingExerciseId, setReplacingExerciseId] = useState<number | null>(
    null
  );
  const [lastWorkoutEnabled, setLastWorkoutEnabled] = useState<boolean>(false);
  const [selectTimerEnabled, setSelectTimerEnabled] = useState<boolean>(false);
  const [selectedTimerOption, setSelectedTimerOption] = useState<number | null>(
    null
  );
  const [selectedCustomRestTime, setSelectedCustomRestTime] = useState<
    number | null
  >();

  const [workoutItems, setWorkoutItems] = useState<Array<PlanItemResponse>>(
    plan.planItems
  );

  const TIMER_OPTIONS = [
    { label: "30 seconds", value: 30 },
    { label: "1 minute", value: 60 },
    { label: "2 minutes", value: 120 },
    { label: "3 minutes", value: 180 },
    { label: "4 minutes", value: 240 },
    { label: "5 minutes", value: 300 },
    { label: "Custom Time (sec)", value: -1 },
  ];

  const { exercises, isLoading: isExercisesLoading } = useAvailableExercises();

  const [workoutCreationRequest, setWorkoutCreationRequest] =
    useState<WorkoutCreationRequest>({
      trainingId: plan.id,
      workoutItems: workoutItems.map((item) => ({
        exerciseId: item.exerciseId,
        type: "REPS",
        sets: Array.from({ length: item.defaultSets }, () => ({
          reps: 0,
          weight: 0,
        })),
      })),
    });

  const lastSessionResults = useQueries({
    queries: workoutItems.map((item) => ({
      queryKey: ["lastSession", item.exerciseId],
      queryFn: () => getWorkoutExerciseHistory(item.exerciseId, 1),
    })),
  });

  const workoutMutation = useMutation<
    GeneralResponse,
    AxiosError<ErrorResponse>,
    WorkoutCreationRequest
  >({
    mutationFn: createWorkout,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["lastSession"] });
      queryClient.invalidateQueries({ queryKey: ["workoutsThisWeek"] });
      queryClient.invalidateQueries({ queryKey: ["lastWorkout"] });
      queryClient.invalidateQueries({ queryKey: ["recentWorkouts"] });

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

  const {
    data: lastWorkout,
    isLoading: isLastWorkoutLoading,
    isError: isLastWorkoutError,
  } = useQuery({
    queryFn: () => getWorkouts(null, null, plan.id, 0, 1),
    queryKey: ["lastWorkout", "plan", plan.id],
    select: (data) => {
      return data.map((workout) => {
        const createdAt = new Date(workout.createdAt);
        createdAt.setHours(0, 0, 0, 0);
        return {
          ...workout,
          createdAt: new Date(createdAt),
        };
      });
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

  const replaceExercise = (newExercise: ExerciseResponse) => {
    if (
      workoutItems.some((item) => item.exerciseId === newExercise.exerciseId)
    ) {
      toast.error("Exercise already exists in the plan");
      return;
    }

    const updatedItems = workoutItems.map((item) =>
      item.exerciseId === replacingExerciseId
        ? {
            ...item,
            exerciseId: newExercise.exerciseId,
            exerciseName: newExercise.name,
          }
        : { ...item }
    );

    setWorkoutItems(updatedItems);

    setWorkoutCreationRequest((prev) => ({
      ...prev,
      workoutItems: prev.workoutItems.map((workoutItem) =>
        workoutItem.exerciseId === replacingExerciseId
          ? {
              ...workoutItem,
              exerciseId: newExercise.exerciseId,
            }
          : workoutItem
      ),
    }));
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
        onClick={() => {
          setSelectedTimerOption(null);
          setSelectTimerEnabled(true);
        }}
        className="mb-2 bg-approve-button-main px-2 py-1 w-full rounded-md flex justify-center items-center gap-2 font-light cursor-pointer hover:bg-hover-approve-button-main transition-colors"
        type="button"
      >
        <FaStopwatch />
        <span>
          {selectedTimerOption ? (
            <RestTimer
              time={selectedTimerOption}
              disableTimer={() => setSelectedTimerOption(null)}
            />
          ) : (
            "Start Rest Timer"
          )}
        </span>
      </button>

      {selectTimerEnabled && (
        <SelectOptionWindow
          title={"Select Timer"}
          onClose={() => setSelectTimerEnabled(false)}
          data={TIMER_OPTIONS}
          onSelect={(timerOption) => {
            if (timerOption.value === -1) {
              return;
            }
            setSelectedTimerOption(timerOption.value);
            setSelectTimerEnabled(false);
          }}
          renderItem={(timerOption) =>
            timerOption.value === -1 ? (
              <div className="flex items-center">
                <input
                  className="w-full no-spinner outline-none"
                  type="number"
                  min={1}
                  placeholder={timerOption.label}
                  value={selectedCustomRestTime || ""}
                  onChange={(e) => {
                    setSelectedCustomRestTime(Number(e.target.value));
                  }}
                  onKeyDown={(e) => {
                    const invalidChars = ["-", "+", "e", "E"];
                    if (invalidChars.includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                <FaCheck
                  size={20}
                  className="cursor-pointer hover:opacity-80 transition-colors"
                  onClick={() => {
                    if (!selectedCustomRestTime) return;
                    setSelectTimerEnabled(false);
                    setSelectedTimerOption(selectedCustomRestTime);
                    setSelectedCustomRestTime(null);
                  }}
                />
              </div>
            ) : (
              <p key={timerOption.value}>{timerOption.label}</p>
            )
          }
        />
      )}

      <button
        className="bg-blue-950 px-2 py-1 rounded-md w-full border border-gray-700 mb-2 font-light cursor-pointer hover:bg-blue-900 transition-colors"
        onClick={() => setLastWorkoutEnabled(true)}
        disabled={
          isLastWorkoutLoading ||
          isLastWorkoutError ||
          !lastWorkout ||
          lastWorkout.length === 0
        }
      >
        Last Workout
      </button>

      {lastWorkoutEnabled && (
        <WorkoutDetails
          workout={lastWorkout![0]}
          onClose={() => setLastWorkoutEnabled(false)}
        />
      )}

      {workoutItems.map((planItem, exerciseIndex) => (
        <div
          key={exerciseIndex}
          className="bg-gray-700 p-2 border-b border-b-gray-700"
        >
          <div className="flex justify-between items-center mb-4 pe-3">
            <div className="flex items-center gap-2">
              <p key={planItem.exerciseId} className="text-xl">
                {planItem.exerciseName}
              </p>
              <FaHistory
                className="cursor-pointer text-gray-400"
                onClick={() => setExerciseHistory(planItem)}
              />
            </div>
            <FaSync
              className="text-gray-400 cursor-pointer"
              onClick={() => setReplacingExerciseId(planItem.exerciseId)}
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

      {replacingExerciseId && (
        <SelectOptionWindow
          title={"Replace Exercise"}
          onClose={() => setReplacingExerciseId(null)}
          data={exercises}
          onSelect={(exercise) => {
            replaceExercise(exercise);
            setReplacingExerciseId(null);
          }}
          renderItem={(exercise) => (
            <p key={exercise.exerciseId}>{exercise.name}</p>
          )}
          isDataLoading={isExercisesLoading}
        />
      )}

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
