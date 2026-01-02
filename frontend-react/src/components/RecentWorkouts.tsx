import { useQuery } from "@tanstack/react-query";
import { getWorkouts, type WorkoutResponse } from "../services/workoutService";
import { displayShortFormattedDate } from "../utils/dateUtils";
import FetchHandler from "./FetchHandler";
import MainPagePanel from "./ui/MainPagePanel";
import { useState } from "react";
import WorkoutDetails from "./modals/WorkoutDetailsModal";

const RecentWorkouts = () => {
  const { data, isLoading, isError } = useQuery({
    queryFn: () => getWorkouts(null, null, 0, 3),
    queryKey: ["recentWorkouts"],
    select: (data) =>
      data.map((workout) => {
        const createdAt = new Date(workout.createdAt);
        createdAt.setHours(0, 0, 0, 0);
        return {
          ...workout,
          createdAt: createdAt,
        };
      }),
  });

  const [selectedWorkout, setSelectedWorkout] =
    useState<WorkoutResponse | null>(null);

  return (
    <>
      <MainPagePanel title={"Recent Workouts"}>
        <FetchHandler
          isEnabled={true}
          isLoading={isLoading}
          isError={isError}
          data={data}
          emptyMessage={"No recent workouts found."}
        >
          {(data) =>
            data.map((workout) => (
              <div
                key={workout.workoutId}
                className="flex justify-between bg-subcomponents-main my-5 p-2 rounded-xl cursor-pointer hover:bg-subcomponents-main-hover transition-colors"
                onClick={() => setSelectedWorkout(workout)}
              >
                <div>
                  <p>{workout.trainingPlan.name}</p>
                  <div className="flex gap-3 text-subcomponents-text-main">
                    <p>{displayShortFormattedDate(workout.createdAt)}</p>
                    <p>{workout.workoutItems.length} exercises</p>
                  </div>
                </div>
                <div>
                  <p className="text-subcomponents-text-main">Volume</p>
                  <p>
                    {workout.workoutItems.reduce(
                      (prev, curr) =>
                        prev +
                        curr.sets.reduce(
                          (prev, curr) => prev + curr.reps * curr.weight,
                          0
                        ),
                      0
                    )}{" "}
                    kg
                  </p>
                </div>
              </div>
            ))
          }
        </FetchHandler>
      </MainPagePanel>
      {selectedWorkout && (
        <WorkoutDetails
          workout={selectedWorkout}
          onClose={() => setSelectedWorkout(null)}
        />
      )}
    </>
  );
};

export default RecentWorkouts;
