interface PlanBlockProps {
  title: string;
  exercises: number;
}

const PlanBlock = ({ title, exercises }: PlanBlockProps) => {
  return (
    <div className="bg-subcomponents-main rounded-xl p-2 my-5 w-full">
      <h2 className="font-semibold">{title}</h2>
      <p className="text-subcomponents-text-main">
        {exercises} {exercises == 1 ? "exercise" : "exercises"}
      </p>
    </div>
  );
};

export default PlanBlock;
