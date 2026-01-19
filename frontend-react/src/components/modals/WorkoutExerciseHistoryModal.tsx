import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { FaHistory, FaTimes } from "react-icons/fa";
import type { PlanItemResponse } from "../../services/trainingService";
import {
  getWorkoutExerciseHistory,
  type WorkoutExerciseHistoryResponse,
} from "../../services/workoutService";
import type { ErrorResponse } from "../../types/ApiResponse";
import AbsoluteWindowWrapper from "../ui/AbsoluteWindowWrapper";
import WorkoutExerciseHistoryLoading from "../WorkoutExerciseHistoryLoading";
import { Fragment } from "react/jsx-runtime";

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

  return (
    <AbsoluteWindowWrapper isOpen={true} onClose={onClose}>
      <div className="w-full mx-auto my-auto">
        <div className="flex items-center justify-between pl-6 pr-4 py-5 border-b border-gray-700/50 rounded-t-xl sticky top-0 z-20">
          <div>
            <div className="flex items-center gap-2">
              <FaHistory size={20} className="text-primary " />
              <h3 className="text-white tracking-tight text-xl font-bold leading-tight">
                History: {planItem.exerciseName}
              </h3>
            </div>
            <p className="text-xs text-gray-400 font-medium mt-1 pl-7">
              Progressive Overload Tracking
            </p>
          </div>
          <button
            className="group flex items-center justify-center w-9 h-9 cursor-pointer rounded-lg bg-transparent hover:bg-gray-700/50 text-gray-400 hover:text-white transition-all duration-200"
            onClick={onClose}
          >
            <FaTimes size={24} className="transition-transform duration-300" />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-2 custom-scrollbar bg-linear-to-b ">
          <div className="grid grid-cols-[40px_1fr] gap-x-3 relative min-h-30">
            {isError ? (
              <div className="flex justify-center items-center col-span-2">
                <span className="text-lg text-gray-400">
                  Failed to fetch history
                </span>
              </div>
            ) : isLoading ? (
              <WorkoutExerciseHistoryLoading />
            ) : !data || data.history.length === 0 ? (
              <div className="flex justify-center items-center col-span-2">
                <span className="text-lg text-gray-400">
                  There is no history for this exercise yet
                </span>
              </div>
            ) : (
              data.history.map((workoutSessionSnapshot, index) => (
                <Fragment key={index}>
                  <div className="flex flex-col items-center pt-2">
                    <div className="flex items-center justify-center w-3 h-3 rounded-full bg-gray-700 mt-5 z-10 ring-4 ring-gray-800"></div>
                  </div>
                  <div className="flex flex-col py-5 pl-2 border-t border-gray-700/30 group hover:bg-gray-800/20 rounded-lg transition-colors px-2 -mx-2">
                    <div className="flex justify-between items-baseline mb-3">
                      <p className="text-gray-300 text-base font-semibold group-hover:text-white transition-colors leading-tight">
                        {format(
                          workoutSessionSnapshot.workoutDate,
                          "MMM dd, yyyy"
                        )}
                        <br></br>
                        <span className="text-xs">
                          {format(workoutSessionSnapshot.workoutDate, "iiii")}
                        </span>
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {workoutSessionSnapshot.sets.map((set, setIndex) => (
                        <div
                          key={setIndex}
                          className="bg-gray-800/80 px-3 py-1.5 rounded-md text-gray-300 border border-gray-700 text-sm font-mono flex items-center gap-2"
                        >
                          <span className="font-bold text-white">
                            {set.weight}
                          </span>
                          <span className="text-[10px] text-gray-500">KG</span>
                          <span className="text-gray-600">|</span>{" "}
                          <span>{set.reps}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Fragment>
              ))
            )}
          </div>
        </div>
      </div>
    </AbsoluteWindowWrapper>
  );
};

export default WorkoutExerciseHistoryModal;
