const WorkoutLogLoading = () => {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer animate-skeleton">
      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
        <div className="h-5 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-5 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-5 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="inline-flex justify-center h-6 w-7/8 rounded bg-gray-200 dark:bg-gray-700"></div>
      </td>
    </tr>
  );
};

export default WorkoutLogLoading;
