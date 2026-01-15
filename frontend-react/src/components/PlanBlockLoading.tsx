const PlanBlockLoading = () => {
  return (
    <div className="">
      <div className="flex flex-col justify-between overflow-hidden rounded-xl bg-white dark:bg-surface-dark p-5 shadow-sm ring-1 ring-gray-900/5 dark:ring-white/10 animate-skeleton">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-2 w-full">
            <div className="h-5 w-3/4 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <div className="mt-6 flex items-center gap-2">
          <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-3 w-1 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default PlanBlockLoading;
