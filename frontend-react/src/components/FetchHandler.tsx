import React from "react";

interface FetchHandlerProps<T> {
  isEnabled: boolean;
  isLoading: boolean;
  isError: boolean;
  data: T[] | undefined;
  emptyMessage: string;
  children: (data: T[]) => React.ReactNode;
}

const FetchHandler = <T,>({
  isEnabled,
  isLoading,
  isError,
  data,
  emptyMessage,
  children,
}: FetchHandlerProps<T>) => {
  const paragraphStyle = "bg-components-main rounded-xl px-2 py-1 mt-2";
  if (!isEnabled) return null;
  if (isLoading) return <p className={paragraphStyle}>Loading...</p>;
  if (isError)
    return (
      <p className={paragraphStyle}>Failed to fetch. Please try again later.</p>
    );
  if (!data || data.length === 0)
    return <p className={paragraphStyle}>{emptyMessage}</p>;
  return <div>{children(data)}</div>;
};

export default FetchHandler;
