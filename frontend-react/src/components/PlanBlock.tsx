interface PlanBlockProps {
  title: string;
  exercises: number;
}

const PlanBlock = ({ title, exercises }: PlanBlockProps) => {
  return (
    <div className="bg-gray-500 rounded-xl p-2 my-3 w-1/3 mx-auto">
      <h2 className="font-semibold">{title}</h2>
      <p className="text-gray-300">
        {exercises} {exercises == 1 ? "exercise" : "exercises"}
      </p>
    </div>
  );
};

export default PlanBlock;
