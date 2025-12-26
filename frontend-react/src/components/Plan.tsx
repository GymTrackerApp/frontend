import {
  FaChevronDown,
  FaChevronUp,
  FaRegEdit,
  FaTrashAlt,
} from "react-icons/fa";
import type { PlanResponse } from "../services/trainingService";
import { useState } from "react";

interface PlanProps {
  plan: PlanResponse;
  updatable: boolean;
  removable: boolean;
}

const Plan = ({ plan, updatable, removable: removeable }: PlanProps) => {
  const [isPlanExpanded, setIsPlanExpanded] = useState<boolean>(false);

  return (
    <>
      <p
        className="bg-gray-700 px-3 py-2 rounded-xl my-3 cursor-pointer hover:bg-gray-600 transition-colors"
        key={plan.id}
        onClick={() => setIsPlanExpanded(!isPlanExpanded)}
      >
        <span className="flex justify-between">
          {plan.name}{" "}
          <span className="flex gap-2">
            {updatable && (
              <FaRegEdit className="cursor-pointer hover:text-blue-400" />
            )}
            {removeable && (
              <FaTrashAlt
                color="red"
                className="cursor-pointer hover:opacity-80"
              />
            )}
            {isPlanExpanded ? (
              <FaChevronUp size={12} />
            ) : (
              <FaChevronDown size={12} />
            )}
          </span>
        </span>
        <span className="text-gray-400">
          {plan.planItems.length}{" "}
          {plan.planItems.length === 1 ? "exercise" : "exercises"}
        </span>
      </p>

      {isPlanExpanded && (
        <ul className="px-1">
          {plan.planItems.map((planItem) => (
            <li key={planItem.exerciseId} className="flex justify-between">
              <span className="text-md">{planItem.exerciseName}</span>
              <span className="text-gray-400">{planItem.defaultSets} sets</span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default Plan;
