import { FaDumbbell, FaPlay, FaTimes } from "react-icons/fa";
import type { ExerciseResponse } from "../../services/exerciseService";
import type { PlanResponse } from "../../services/trainingService";
import AbsoluteWindowWrapper from "../ui/AbsoluteWindowWrapper";
import { calculateAverageTrainingTime } from "../../utils/plansUtils";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

interface TrainingPlanDetailsModalProps {
  onClose: () => void;
  plan: PlanResponse;
  exercises: Array<ExerciseResponse>;
}

const TrainingPlanDetailsModal = ({
  onClose,
  plan,
  exercises,
}: TrainingPlanDetailsModalProps) => {
  const navigate = useNavigate();

  const handleWorkoutStart = (trainingPlan: PlanResponse) => {
    toast.success(`Starting workout: ${trainingPlan.name}`);
    navigate("/workout?trainingPlanId=" + trainingPlan.id);
  };

  return (
    <AbsoluteWindowWrapper isOpen={true} onClose={onClose}>
      <div className="flex items-center justify-between pl-6 pr-4 py-5 border-b border-gray-700/50 bg-[#1F2937] rounded-t-xl sticky top-0 z-20">
        <div>
          <div className="flex items-center gap-3">
            <FaDumbbell size={20} className="text-primary rotate-45" />
            <h3 className="text-white tracking-tight text-xl font-bold leading-tight">
              {plan.name}
            </h3>
          </div>
        </div>
        <button
          className="group flex items-center justify-center w-9 h-9 cursor-pointer rounded-lg bg-transparent hover:bg-gray-700/50 text-gray-400 hover:text-white transition-all duration-200"
          onClick={onClose}
        >
          <FaTimes size={24} className="transition-transform duration-300" />
        </button>
      </div>
      <div className="overflow-y-auto px-6 py-6 scrollbar-none bg-linear-to-b from-[#1F2937] to-[#1a232f] space-y-4">
        {plan.planItems.map((planItem) => (
          <div
            key={planItem.exerciseId}
            className="bg-gray-800/40 border border-gray-700/40 rounded-xl p-5 hover:bg-gray-800/60 transition-colors group"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-white text-lg font-bold">
                  {planItem.exerciseName}
                </h4>
                <span className="text-xs text-gray-400 font-medium tracking-wide uppercase">
                  {
                    exercises.find(
                      (exercise) => exercise.exerciseId === planItem.exerciseId
                    )?.category
                  }
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-black/20 rounded-lg p-4 border border-gray-700/30">
              <div className="flex-1">
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter mb-1">
                  Volume Protocol
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white">
                    {planItem.defaultSets}
                  </span>
                  <span className="text-sm text-gray-400 font-medium uppercase tracking-wider">
                    {planItem.defaultSets === 1 ? "Set" : "Sets"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="px-6 py-4 border-t border-gray-700/50 flex justify-between items-center bg-[#1F2937] rounded-b-xl">
        <div>
          <span className="text-md font-medium text-gray-500">
            ~{calculateAverageTrainingTime(plan)} minutes
          </span>
          <span className="text-md font-medium text-gray-500"> | </span>
          <span className="text-md font-medium text-gray-500">
            {plan.planItems.length}{" "}
            {plan.planItems.length === 1 ? "exercise" : "exercises"}
          </span>
        </div>
        <button
          className="bg-primary hover:bg-blue-600 active:scale-95 text-white text-sm font-bold py-2 px-6 rounded-lg transition-all shadow-lg shadow-primary/20 flex items-center gap-2 cursor-pointer"
          onClick={() => handleWorkoutStart(plan)}
        >
          Start Workout
          <FaPlay size={18} />
        </button>
      </div>
    </AbsoluteWindowWrapper>
  );
};

export default TrainingPlanDetailsModal;
