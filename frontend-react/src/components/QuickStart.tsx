import { useState } from "react";
import { FaPlay } from "react-icons/fa";
import { type PlanResponse } from "../services/trainingService";
import SelectOptionWindow from "./SelectOptionWindow";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

interface QuickStartProps {
  data: Array<PlanResponse>;
  isLoading: boolean;
}

const QuickStart = ({ data, isLoading }: QuickStartProps) => {
  const [selectWorkoutEnabled, setSelectWorkoutEnabled] =
    useState<boolean>(false);

  const navigate = useNavigate();

  const handleWorkoutStart = (trainingPlan: PlanResponse) => {
    toast.success(`Starting workout: ${trainingPlan.name}`);
    navigate("/workout?trainingPlanId=" + trainingPlan.id);
  };

  return (
    <div className="w-full bg-gray-700 px-2 py-2 pb-10 mt-3">
      <h1 className="text-2xl font-semibold">Quick Start</h1>
      <button
        className="bg-approve-button-main hover:bg-hover-approve-button-main w-1/3 flex justify-center py-2 rounded-xl mx-auto cursor-pointer transition-colors"
        onClick={() => setSelectWorkoutEnabled(true)}
      >
        <span aria-hidden="true" className="flex items-center mr-2">
          <FaPlay />
        </span>
        <span>Start Your Workout</span>
      </button>
      {selectWorkoutEnabled && (
        <SelectOptionWindow
          title={"Select a Plan"}
          onClose={() => setSelectWorkoutEnabled(false)}
          data={isLoading ? [] : data}
          emptyDataMessage="Loading plans..."
          onSelect={(item) => handleWorkoutStart(item)}
          renderItem={(plan) => (
            <p className="flex flex-col">
              <span className="">{plan.name}</span>
              <span className="text-gray-400">
                {plan.planItems.length}{" "}
                {plan.planItems.length === 1 ? "exercise" : "exercises"}
              </span>
            </p>
          )}
        />
      )}
    </div>
  );
};

export default QuickStart;
