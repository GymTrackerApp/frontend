
interface LoadingFailedProps {
  message: string;
}

const LoadingFailed = ({ message }: LoadingFailedProps) => {
  return (
    <p className="text-red-500 border border-red-200 bg-red-50 p-2 rounded-xl col-span-full text-start">
      {message}
    </p>
  );
};

export default LoadingFailed;
