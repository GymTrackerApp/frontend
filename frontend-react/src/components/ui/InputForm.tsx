import clsx from "clsx";
import React from "react";

interface InputFormProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  structure?: "vertical" | "horizontal";
}

const InputForm = ({ id, label, structure, ...props }: InputFormProps) => {
  const isVertical = structure === "vertical";
  return (
    <>
      <label
        className={clsx("mt-2 font-semibold", { block: isVertical })}
        htmlFor={id}
      >
        {label}
      </label>
      <input
        className="mt-0.5 mb-2 bg-gray-800 border border-gray-500 w-full focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-md ps-1"
        id={id}
        {...props}
      />
    </>
  );
};

export default InputForm;
