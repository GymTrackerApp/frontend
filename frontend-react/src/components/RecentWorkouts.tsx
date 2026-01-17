import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getWorkouts, type WorkoutResponse } from "../services/workoutService";
import WorkoutDetails from "./modals/WorkoutDetailsModal";
import WorkoutLog from "./WorkoutLog";
import WorkoutLogLoading from "./WorkoutLogLoading";

const RecentWorkouts = () => {
  const { data, isLoading, isError } = useQuery({
    queryFn: () => getWorkouts(null, null, null, 0, 3),
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
      <div className="col-span-3 flex flex-col gap-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Recent Workouts
        </h2>
        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark shadow-sm">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs uppercase text-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-6 py-3" scope="col">
                  Workout
                </th>
                <th className="px-6 py-3" scope="col">
                  Date
                </th>
                <th className="px-6 py-3" scope="col">
                  Volume
                </th>
                <th className="hidden sm:block px-9 py-3" scope="col">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {isLoading || isError || !data ? (
                <WorkoutLogLoading />
              ) : (
                data.map((workout) => (
                  <WorkoutLog
                    key={workout.workoutId}
                    workout={workout}
                    setSelectedWorkout={setSelectedWorkout}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
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
