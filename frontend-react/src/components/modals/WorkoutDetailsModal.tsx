import { FaTimes } from "react-icons/fa";
import type { WorkoutResponse } from "../../services/workoutService";
import { displayLongFormattedDate } from "../../utils/dateUtils";
import { calculateWorkoutVolume } from "../../utils/workoutUtils";
import AbsoluteWindowWrapper from "../ui/AbsoluteWindowWrapper";

interface WorkoutDetailsProps {
  workout: WorkoutResponse;
  onClose: () => void;
}

const WorkoutDetails = ({ workout, onClose }: WorkoutDetailsProps) => {
  return (
    <AbsoluteWindowWrapper isOpen={true} onClose={onClose} windowSize="large">
      <header className="flex justify-between items-center">
        <p className="text-2xl font-bold">Workout Details</p>
        <FaTimes className="cursor-pointer hover:opacity-80" onClick={onClose}/>
      </header>
      <section>
        <p className="text-lg font-bold mt-3">{workout.trainingPlan.name}</p>
        <div className="flex justify-between gap-2">
          <div className="bg-subcomponents-main w-full p-2">
            <p className="text-subcomponents-text-main">Date</p>
            <p>{displayLongFormattedDate(workout.createdAt)}</p>
          </div>
          <div className="bg-subcomponents-main w-full p-2">
            <p className="text-subcomponents-text-main">Volume</p>
            <p>{calculateWorkoutVolume(workout)} kg</p>
          </div>
        </div>
      </section>

      <section>
        <p className="text-lg font-bold mt-3">Exercises</p>
        {workout.workoutItems.map((workoutItem) => (
          <div
            key={workoutItem.exercise.exerciseId}
            className="bg-subcomponents-main mt-3 p-1 first-of-type:mt-0"
          >
            <p className="font-light">{workoutItem.exercise.name}</p>
            <p className="text-subcomponents-text-main font-thin">
              Volume:{" "}
              {workoutItem.sets.reduce(
                (prev, curr) => prev + curr.reps * curr.weight,
                0
              )}{" "}
              kg
            </p>
            <div className="grid grid-cols-3 gap-2 text-sm text-center text-subcomponents-text-main">
              <span className="text-left">Set</span>
              <span>Weight (kg)</span>
              <span>Reps</span>
            </div>
            {workoutItem.sets.map((set, setIndex) => (
              <div
                className="grid grid-cols-3 gap-2 text-sm text-center"
                key={setIndex}
              >
                <p className="text-left">#{setIndex + 1}</p>
                <p>{set.weight} kg</p>
                <p>{set.reps}</p>
              </div>
            ))}
          </div>
        ))}
      </section>
    </AbsoluteWindowWrapper>
  );
};

export default WorkoutDetails;
