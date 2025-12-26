import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  FaTrashAlt
} from "react-icons/fa";
import FetchHandler from "../components/FetchHandler";
import Header from "../components/Header";
import NewExerciseModal from "../components/NewExerciseModal";
import NewPlanModal from "../components/NewPlanModal";
import Plan from "../components/Plan";
import PlanManagerSection from "../components/PlanManagerSection";
import PlanManagerToggleTabs from "../components/PlanManagerToggleTabs";
import {
  getPredefinedExercises,
  getUserExercises,
  type ExerciseResponse,
} from "../services/exerciseService";
import {
  getPredefinedPlans,
  getUserPlans,
  type PlanResponse,
} from "../services/trainingService";
import type { ErrorResponse } from "../types/ApiResponse";

const PlanManager = () => {
  const [newPlanModalEnabled, setNewPlanModalEnabled] =
    useState<boolean>(false);
  const [newExerciseModalEnabled, setNewExerciseModalEnabled] =
    useState<boolean>(false);

  const [isMyPlansEnabled, setIsMyPlansEnabled] = useState<boolean>(true);
  const [isPredefinedPlansEnabled, setIsPredefinedPlansEnabled] =
    useState<boolean>(false);
  const [isMyExercisesEnabled, setisMyExercisesEnabled] =
    useState<boolean>(false);

  const {
    data: myExercises,
    isLoading: isMyExercisesLoading,
    isError: isMyExercisesError,
  } = useQuery<Array<ExerciseResponse>, ErrorResponse>({
    queryFn: getUserExercises,
    queryKey: ["userExercises"],
  });

  const {
    data: predefinedPlans,
    isLoading: isPredefinedPlansLoading,
    isError: isPredefinedPlansError,
  } = useQuery<Array<PlanResponse>, ErrorResponse>({
    queryFn: getPredefinedPlans,
    queryKey: ["predefinedPlans"],
  });

  const {
    data: myPlans,
    isLoading: isMyPlansLoading,
    isError: isMyPlansError,
  } = useQuery<Array<PlanResponse>, ErrorResponse>({
    queryFn: getUserPlans,
    queryKey: ["userPlans"],
  });

  const { data: predefinedExercises } = useQuery<
    Array<ExerciseResponse>,
    ErrorResponse
  >({
    queryFn: getPredefinedExercises,
    queryKey: ["predefinedExercises"],
  });

  const allUserAvailableExercises = [
    ...(predefinedExercises || []),
    ...(myExercises || []),
  ];

  return (
    <>
      <Header />
      <div className="bg-gray-800 text-white p-3 min-h-dvh">
        <h1 className="text-3xl font-bold">Plan Manager</h1>
        <p className="text-gray-400">Create and manage your training plans</p>
        <div className="">
          <PlanManagerToggleTabs
            isMyPlansEnabled={isMyPlansEnabled}
            isPredefinedPlansEnabled={isPredefinedPlansEnabled}
            isMyExercisesEnabled={isMyExercisesEnabled}
            setIsMyPlansEnabled={setIsMyPlansEnabled}
            setisPredefinedPlansEnabled={setIsPredefinedPlansEnabled}
            setisMyExercisesEnabled={setisMyExercisesEnabled}
          />

          {/* My Plans */}

          <PlanManagerSection
            isVisible={isMyPlansEnabled}
            onClick={() => {
              setNewPlanModalEnabled(true);
            }}
            isButton={true}
            buttonText="Create New Plan"
          />

          {newPlanModalEnabled && (
            <NewPlanModal
              exercises={allUserAvailableExercises}
              onClose={() => setNewPlanModalEnabled(false)}
            />
          )}

          <FetchHandler
            isEnabled={isMyPlansEnabled}
            isLoading={isMyPlansLoading}
            isError={isMyPlansError}
            data={myPlans}
            emptyMessage={"You currently don't have any plans."}
          >
            {(data: Array<PlanResponse>) =>
              data.map((plan) => (
                <Plan plan={plan} updatable={true} removable={true} />
              ))
            }
          </FetchHandler>

          {/* My Exercises */}

          <PlanManagerSection
            isVisible={isMyExercisesEnabled}
            onClick={() => {
              setNewExerciseModalEnabled(true);
            }}
            isButton={true}
            buttonText="Create New Exercise"
          />

          {newExerciseModalEnabled && (
            <NewExerciseModal
              onClose={() => setNewExerciseModalEnabled(false)}
            />
          )}

          <FetchHandler
            isEnabled={isMyExercisesEnabled}
            isLoading={isMyExercisesLoading}
            isError={isMyExercisesError}
            data={myExercises}
            emptyMessage={"You currently don't have any exercises."}
          >
            {(data: Array<ExerciseResponse>) =>
              data.map((ex) => (
                <p
                  key={ex.exerciseId}
                  className="flex flex-col bg-gray-700 rounded-xl my-3 px-3 py-1"
                >
                  <span className="flex justify-between items-center">
                    <span>{ex.name}</span>{" "}
                    <FaTrashAlt
                      color="red"
                      size={15}
                      className="cursor-pointer hover:opacity-80"
                    />
                  </span>
                  <span className="text-gray-400 text-sm">{ex.category}</span>
                </p>
              ))
            }
          </FetchHandler>

          {/* Predefined Plans */}

          <FetchHandler
            isEnabled={isPredefinedPlansEnabled}
            isLoading={isPredefinedPlansLoading}
            isError={isPredefinedPlansError}
            data={predefinedPlans}
            emptyMessage={"There are currently no predefined plans."}
          >
            {(data: Array<PlanResponse>) =>
              data.map((plan: PlanResponse) => (
                <Plan plan={plan} updatable={false} removable={false} />
              ))
            }
          </FetchHandler>
        </div>
      </div>
    </>
  );
};

export default PlanManager;
