import { useQuery } from "@tanstack/react-query";
import { format, subDays, subMonths } from "date-fns";
import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import ProgressChart, { type DataContent } from "../components/ProgressChart";
import SelectOptionWindow from "../components/ui/SelectOptionWindow";
import type { ExerciseResponse } from "../services/exerciseService";
import {
  getWorkoutExerciseHistoryByWorkoutInPeriod,
  getWorkoutTrainingHistoryByWorkoutInPeriod,
  type WorkoutExerciseHistoryResponse,
  type WorkoutTrainingHistoryResponse,
} from "../services/workoutService";
import {
  useAvailableExercises,
  useAvailablePlans,
} from "../hooks/useWorkoutFlow";
import Header from "../components/Header";
import type { PlanResponse } from "../services/trainingService";

type MetricType = "training" | "exercise";

interface MetricOption {
  label: string;
  value: MetricType;
}

const METRIC_OPTIONS: MetricOption[] = [
  { label: "Total Training Volume", value: "training" },
  { label: "Exercise Performance", value: "exercise" },
];

type DateRangeType = "7d" | "30d" | "60d" | "90d" | "6m";

interface DateRangeOption {
  label: string;
  value: DateRangeType;
}

const DATE_RANGE_OPTIONS: DateRangeOption[] = [
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 60 days", value: "60d" },
  { label: "Last 90 days", value: "90d" },
  { label: "Last 6 month", value: "6m" },
];

type WindowType = "metric" | "range" | "exercise" | "training" | null;

const Progress = () => {
  const [selectedMetricType, setSelectedMetricType] =
    useState<MetricType>("exercise");
  const [selectedExercise, setSelectedExercise] = useState<ExerciseResponse>();
  const [selectedTraining, setSelectedTraining] = useState<PlanResponse>();
  const [selectedDateRange, setSelectedDateRange] =
    useState<DateRangeType>("7d");
  const [activeWindow, setActiveWindow] = useState<WindowType>(null);

  const getStartDate = (range: DateRangeType) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    switch (range) {
      case "7d":
        return subDays(now, 7);
      case "30d":
        return subDays(now, 30);
      case "60d":
        return subDays(now, 60);
      case "90d":
        return subDays(now, 90);
      case "6m":
        return subMonths(now, 6);
    }
  };

  const getCurrentDate = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  };

  const prepareChartData = (
    data: WorkoutExerciseHistoryResponse | WorkoutTrainingHistoryResponse
  ): Array<DataContent> | undefined => {
    if (!data) return;

    if ("trainingId" in data) {
      return data.history.map((snapshot) => ({
        date: format(snapshot.workoutDate, "yyyy-MM-dd"),
        value: snapshot.sets.reduce(
          (prev, curr) => prev + curr.reps * curr.weight,
          0
        ),
      }));
    } else if ("exerciseId" in data) {
      return data.history.map((snapshot) => ({
        date: format(snapshot.workoutDate, "yyyy-MM-dd"),
        value:
          snapshot.sets.reduce((prev, curr) => prev + curr.weight, 0) /
          snapshot.sets.length,
      }));
    }
  };

  const {
    data: exerciseHistoryData,
    isLoading: isExerciseHistoryLoading,
    isError: isExerciseHistoryError,
  } = useQuery({
    queryFn: () =>
      getWorkoutExerciseHistoryByWorkoutInPeriod(
        selectedExercise!.exerciseId,
        getStartDate(selectedDateRange),
        getCurrentDate()
      ),
    queryKey: [
      "exerciseHistory",
      selectedExercise?.exerciseId,
      getStartDate(selectedDateRange),
      getCurrentDate(),
    ],
    enabled:
      !!selectedExercise &&
      !!selectedDateRange &&
      selectedMetricType === "exercise",
  });

  const {
    data: trainingHistoryData,
    isLoading: isTrainingHistoryLoading,
    isError: isTrainingHistoryError,
  } = useQuery({
    queryFn: () =>
      getWorkoutTrainingHistoryByWorkoutInPeriod(
        selectedTraining!.id,
        getStartDate(selectedDateRange),
        getCurrentDate()
      ),
    queryKey: [
      "trainingHistory",
      selectedTraining?.id,
      getStartDate(selectedDateRange),
      getCurrentDate(),
    ],
    enabled:
      !!selectedTraining &&
      !!selectedDateRange &&
      selectedMetricType === "training",
  });

  const { exercises, isLoading: isExercisesLoading } = useAvailableExercises();
  const { plans: trainingPlans, isLoading: isTrainingPlansLoading } =
    useAvailablePlans();

  return (
    <>
      <Header />
      <div className="bg-background-main text-white min-h-dvh">
        <h1>Progress & Metrics</h1>
        <p>Track your training progress over time</p>
        <div>
          <p>Metric Type</p>
          <button
            className="cursor-pointer w-full text-left flex justify-between items-center px-2 py-1 bg-components-main hover:bg-gray-600 transition-colors"
            onClick={() => setActiveWindow("metric")}
          >
            <span>
              {selectedMetricType
                ? METRIC_OPTIONS.filter(
                    (metricOption) => metricOption.value === selectedMetricType
                  )[0].label
                : "Select Metric Type"}
            </span>
            {activeWindow === "metric" ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {activeWindow === "metric" && (
            <SelectOptionWindow
              title={"Select Metric Type"}
              onClose={() => setActiveWindow(null)}
              data={METRIC_OPTIONS}
              onSelect={(item) => {
                setSelectedMetricType(item.value);
                setActiveWindow(null);
              }}
              renderItem={(item) => <p>{item.label}</p>}
            />
          )}

          {selectedMetricType === "exercise" && (
            <>
              <p>Exercise</p>
              <button
                className="cursor-pointer w-full text-left flex justify-between items-center px-2 py-1 bg-components-main hover:bg-gray-600 transition-colors"
                onClick={() => setActiveWindow("exercise")}
              >
                <span>
                  {selectedExercise ? selectedExercise.name : "Select Exercise"}
                </span>
                {activeWindow === "exercise" ? (
                  <FaChevronUp />
                ) : (
                  <FaChevronDown />
                )}
              </button>
              {activeWindow === "exercise" && (
                <SelectOptionWindow
                  title={"Select Exercise"}
                  onClose={() => setActiveWindow(null)}
                  data={exercises}
                  isDataLoading={isExercisesLoading}
                  onSelect={(exercise) => {
                    setSelectedExercise(exercise);
                    setActiveWindow(null);
                  }}
                  renderItem={(exercise) => <p>{exercise.name}</p>}
                />
              )}
            </>
          )}

          {selectedMetricType === "training" && (
            <>
              <p>Training</p>
              <button
                className="cursor-pointer w-full text-left flex justify-between items-center px-2 py-1 bg-components-main hover:bg-gray-600 transition-colors"
                onClick={() => setActiveWindow("training")}
              >
                <span>
                  {selectedTraining
                    ? selectedTraining.name
                    : "Select Training Plan"}
                </span>
                {activeWindow === "training" ? (
                  <FaChevronUp />
                ) : (
                  <FaChevronDown />
                )}
              </button>
              {activeWindow === "training" && (
                <SelectOptionWindow
                  title={"Select Training Plan"}
                  onClose={() => setActiveWindow(null)}
                  data={trainingPlans}
                  isDataLoading={isTrainingPlansLoading}
                  onSelect={(training) => {
                    setSelectedTraining(training);
                    setActiveWindow(null);
                  }}
                  renderItem={(training) => <p>{training.name}</p>}
                />
              )}
            </>
          )}

          <p>Date Range</p>
          <button
            className="cursor-pointer w-full text-left flex justify-between items-center px-2 py-1 bg-components-main hover:bg-gray-600 transition-colors"
            onClick={() => setActiveWindow("range")}
          >
            <span>
              {selectedDateRange
                ? DATE_RANGE_OPTIONS.filter(
                    (dataRangeOption) =>
                      dataRangeOption.value === selectedDateRange
                  )[0].label
                : "Select Date Range"}
            </span>
            {activeWindow === "range" ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {activeWindow === "range" && (
            <SelectOptionWindow
              title={"Select Date Range"}
              onClose={() => setActiveWindow(null)}
              data={DATE_RANGE_OPTIONS}
              onSelect={(item) => {
                setSelectedDateRange(item.value);
                setActiveWindow(null);
              }}
              renderItem={(item) => <p>{item.label}</p>}
            />
          )}
        </div>

        <div className="bg-components-main mt-5 p-2">
          <h1 className="text-xl font-bold">
            {selectedMetricType === "training"
              ? `${selectedTraining ? selectedTraining.name : ""} Total Volume`
              : `${selectedExercise ? selectedExercise.name : ""} Progress`}
          </h1>
          {selectedMetricType === "exercise" ? (
            isExerciseHistoryError ? (
              <p>Error when fetching exercise history</p>
            ) : isExerciseHistoryLoading ? (
              <p>Loading exercise history...</p>
            ) : (
              <ProgressChart
                historyData={prepareChartData(exerciseHistoryData!)!}
                yAxisTitle="Weight (kg)"
              />
            )
          ) : selectedMetricType === "training" ? (
            isTrainingHistoryError ? (
              <p>Error when fetching training history</p>
            ) : isTrainingHistoryLoading ? (
              <p>Loading training history...</p>
            ) : (
              <ProgressChart
                historyData={prepareChartData(trainingHistoryData!)!}
                yAxisTitle="Volume (kg)"
              />
            )
          ) : (
            <p>Select metric to see progress.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Progress;
