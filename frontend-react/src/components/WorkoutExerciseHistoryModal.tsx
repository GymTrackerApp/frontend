import React from "react";
import type { PlanItemResponse } from "../services/trainingService";
import AbsoluteWindowWrapper from "./AbsoluteWindowWrapper";
import { FaCross, FaTimes } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import {
  getWorkoutExerciseHistory,
  type WorkoutExerciseHistoryResponse,
} from "../services/workoutService";
import type { ErrorResponse } from "../types/ApiResponse";
import FetchHandler from "./FetchHandler";

interface WorkoutExerciseHistoryModal {
  planItem: PlanItemResponse;
  onClose: () => void;
}

const WorkoutExerciseHistoryModal = ({
  planItem,
  onClose,
}: WorkoutExerciseHistoryModal) => {
  const { data, isLoading, isError } = useQuery<
    WorkoutExerciseHistoryResponse,
    ErrorResponse
  >({
    queryFn: () => getWorkoutExerciseHistory(planItem.exerciseId),
    queryKey: ["exerciseHistory", planItem.exerciseId],
    enabled: !!planItem,
  });

  const displayDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("pl-PL", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <AbsoluteWindowWrapper isOpen={true} onClose={onClose}>
      <>
        <header className="flex justify-between items-center">
          <p className="text-xl font-semibold">
            History: {planItem.exerciseName}
          </p>
          <FaTimes onClick={onClose} />
        </header>
        <div className="flex flex-col gap-2">
          <FetchHandler
            isEnabled={true}
            isLoading={isLoading}
            isError={isError}
            data={data?.history}
            emptyMessage={"No exercise history available"}
          >
            {(data) =>
              data.map((workoutSessionSnapshot) => (
                <div
                  key={workoutSessionSnapshot.workoutId}
                  className="bg-gray-800 p-2 my-2"
                >
                  <p className="text-gray-400 mb-1">
                    {displayDate(workoutSessionSnapshot.workoutDate)}
                  </p>
                  <div className="flex gap-2">
                    {workoutSessionSnapshot.sets.map((set) => (
                      <p className="bg-gray-500 px-1 rounded-sm text-sm">
                        {set.weight}kg <FaTimes className="inline" size={10} />{" "}
                        {set.reps}
                      </p>
                    ))}
                  </div>
                </div>
              ))
            }
          </FetchHandler>
        </div>
      </>
    </AbsoluteWindowWrapper>
  );
};

export default WorkoutExerciseHistoryModal;
