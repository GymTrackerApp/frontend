import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import Header from "../components/Header";
import NewExerciseModal from "../components/NewExerciseModal";

const PlanManager = () => {
  const [newExerciseModalEnabled, setNewExerciseModalEnabled] =
    useState<boolean>(false);
  return (
    <>
      <Header />
      <div className="bg-gray-800 text-white p-3 min-h-dvh">
        <h1 className="text-3xl font-bold">Plan Manager</h1>
        <p className="text-gray-400">Create and manage your training plans</p>
        <p className="">My Exercises</p>
        <button
          className="bg-blue-500 px-3 rounded-xl flex justify-center items-center cursor-pointer hover:bg-blue-400 transition-colors"
          onClick={() => setNewExerciseModalEnabled(true)}
        >
          <FaPlus className="mr-2" />
          Create New Exercise
        </button>
        {newExerciseModalEnabled && (
          <NewExerciseModal onClose={() => setNewExerciseModalEnabled(false)} />
        )}
      </div>
    </>
  );
};

export default PlanManager;
