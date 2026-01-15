import { useQuery } from "@tanstack/react-query";
import { format, subDays, subMonths } from "date-fns";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ProgressChart, { type DataContent } from "../components/ProgressChart";
import ProgressPagePanel from "../components/ProgressPagePanel";
import {
  useAvailableExercises,
  useAvailablePlans,
} from "../hooks/useWorkoutFlow";
import { type ExerciseResponse } from "../services/exerciseService";
import type { PlanResponse } from "../services/trainingService";
import {
  getWorkoutExerciseHistoryByWorkoutInPeriod,
  getWorkoutTrainingHistoryByWorkoutInPeriod,
  type WorkoutExerciseHistoryResponse,
  type WorkoutTrainingHistoryResponse,
} from "../services/workoutService";
import { getCurrentDate } from "../utils/dateUtils";

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
  { label: "Last 6 months", value: "6m" },
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

  const currentDate = getCurrentDate();

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

  const prepareChartData = (
    data: WorkoutExerciseHistoryResponse | WorkoutTrainingHistoryResponse
  ): Array<DataContent> | undefined => {
    if (!data) return undefined;

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
          (snapshot.sets.length === 0 ? 1 : snapshot.sets.length),
      }));
    }

    return undefined;
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
        currentDate
      ),
    queryKey: [
      "exerciseHistory",
      selectedExercise?.exerciseId,
      getStartDate(selectedDateRange),
      currentDate,
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
        currentDate
      ),
    queryKey: [
      "trainingHistory",
      selectedTraining?.id,
      getStartDate(selectedDateRange),
      currentDate,
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
      <Sidebar />
      <div className="bg-background-main text-white min-h-dvh p-3">
        <h1 className="text-3xl font-bold">Progress & Metrics</h1>
        <p className="text-gray-400 mb-3">
          Track your training progress over time
        </p>
        <div>
          <ProgressPagePanel
            isVisible={true}
            title={"Metric Type"}
            buttonText={
              selectedMetricType
                ? METRIC_OPTIONS.filter(
                    (metricOption) => metricOption.value === selectedMetricType
                  )[0].label
                : "Select Metric Type"
            }
            setActiveWindow={() => setActiveWindow("metric")}
            disableActiveWindow={() => setActiveWindow(null)}
            isActiveWindow={activeWindow === "metric"}
            windowTitle="Select Metric Type"
            windowData={METRIC_OPTIONS}
            isWindowDataLoading={false}
            onSelectData={(item) => {
              setSelectedMetricType(item.value);
              setActiveWindow(null);
            }}
            renderWindowItem={(item) => <p>{item.label}</p>}
          />

          <ProgressPagePanel
            isVisible={selectedMetricType === "exercise"}
            title={"Exercise"}
            buttonText={
              selectedExercise ? selectedExercise.name : "Select Exercise"
            }
            setActiveWindow={() => setActiveWindow("exercise")}
            disableActiveWindow={() => setActiveWindow(null)}
            isActiveWindow={activeWindow === "exercise"}
            windowTitle="Select Exercise"
            windowData={exercises}
            windowDataFilterFunction={(data, keyword) =>
              data.filter((exercise) =>
                exercise.name.toLowerCase().includes(keyword.toLowerCase())
              )
            }
            isWindowDataLoading={isExercisesLoading}
            onSelectData={(exercise) => {
              setSelectedExercise(exercise);
              setActiveWindow(null);
            }}
            renderWindowItem={(exercise) => <p>{exercise.name}</p>}
          />

          <ProgressPagePanel
            isVisible={selectedMetricType === "training"}
            title={"Training"}
            buttonText={
              selectedTraining ? selectedTraining.name : "Select Training Plan"
            }
            setActiveWindow={() => setActiveWindow("training")}
            disableActiveWindow={() => setActiveWindow(null)}
            isActiveWindow={activeWindow === "training"}
            windowTitle="Select Training Plan"
            windowData={trainingPlans}
            windowDataFilterFunction={(data, keyword) =>
              data.filter((plan) =>
                plan.name.toLowerCase().includes(keyword.toLowerCase())
              )
            }
            isWindowDataLoading={isTrainingPlansLoading}
            onSelectData={(training) => {
              setSelectedTraining(training);
              setActiveWindow(null);
            }}
            renderWindowItem={(training) => <p>{training.name}</p>}
          />

          <ProgressPagePanel
            isVisible={true}
            title={"Date Range"}
            buttonText={
              selectedDateRange
                ? DATE_RANGE_OPTIONS.filter(
                    (dataRangeOption) =>
                      dataRangeOption.value === selectedDateRange
                  )[0].label
                : "Select Date Range"
            }
            setActiveWindow={() => setActiveWindow("range")}
            disableActiveWindow={() => setActiveWindow(null)}
            isActiveWindow={activeWindow === "range"}
            windowTitle="Select Date Range"
            windowData={DATE_RANGE_OPTIONS}
            isWindowDataLoading={false}
            onSelectData={(item) => {
              setSelectedDateRange(item.value);
              setActiveWindow(null);
            }}
            renderWindowItem={(item) => <p>{item.label}</p>}
          />
        </div>

        <div className="bg-components-main mt-6 p-2">
          <h1 className="text-xl font-bold">
            {selectedMetricType === "training"
              ? selectedTraining
                ? `${selectedTraining.name} Total Volume`
                : "Select a training plan to view volume"
              : selectedExercise
              ? `${selectedExercise.name} Progress`
              : "Select an exercise to view progress"}
          </h1>
          {selectedMetricType === "exercise" ? (
            isExerciseHistoryError ? (
              <p>Error when fetching exercise history</p>
            ) : isExerciseHistoryLoading ? (
              <p>Loading exercise history...</p>
            ) : !exerciseHistoryData ? (
              <p>No data available</p>
            ) : (
              <ProgressChart
                historyData={prepareChartData(exerciseHistoryData) || []}
                yAxisTitle="Weight (kg)"
              />
            )
          ) : selectedMetricType === "training" ? (
            isTrainingHistoryError ? (
              <p>Error when fetching training history</p>
            ) : isTrainingHistoryLoading ? (
              <p>Loading training history...</p>
            ) : !trainingHistoryData ? (
              <p>No data available</p>
            ) : (
              <ProgressChart
                historyData={prepareChartData(trainingHistoryData) || []}
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
