import { useState } from "react";
import { FaPlay } from "react-icons/fa";
import { type PlanResponse } from "../services/trainingService";
import SelectOptionWindow from "./ui/SelectOptionWindow";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import Button from "./ui/Button";
import MainPagePanel from "./ui/MainPagePanel";

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
    <>
      <MainPagePanel title={"Quick Start"}>
        <Button
          btnStyle={"approve"}
          size={"big"}
          additionalStyle={"w-1/3 mx-auto rounded-md"}
          onClick={() => setSelectWorkoutEnabled(true)}
        >
          <FaPlay />
          <span>Start your workout</span>
        </Button>
      </MainPagePanel>

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
    </>
  );
};

export default QuickStart;
