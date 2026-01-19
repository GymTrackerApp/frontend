import type { WorkoutResponse } from "../services/workoutService";
import { displayShortFormattedDate } from "../utils/dateUtils";
import { calculateWorkoutVolume } from "../utils/workoutUtils";

interface WorkoutLogProps {
  workout: WorkoutResponse;
  setSelectedWorkout: (workout: WorkoutResponse) => void;
}

const WorkoutLog = ({ workout, setSelectedWorkout }: WorkoutLogProps) => {
  return (
    <tr
      className="hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer"
      onClick={() => setSelectedWorkout(workout)}
    >
      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
        {workout.trainingPlan.name}
      </td>
      <td className="px-6 py-4">
        {displayShortFormattedDate(workout.createdAt)}
      </td>
      <td className="px-6 py-4">{calculateWorkoutVolume(workout)} kg</td>
      <td className="hidden sm:block px-6 py-4">
        <span className="inline-flex rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20">
          Complete
        </span>
      </td>
    </tr>
  );
};

export default WorkoutLog;
