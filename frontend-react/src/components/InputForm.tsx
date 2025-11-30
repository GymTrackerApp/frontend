import React from "react";

interface InputFormProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
}

const InputForm = ({ id, label, ...props }: InputFormProps) => {
  return (
    <>
      <label className="mx-2 mt-2 font-semibold" htmlFor={id}>
        {label}
      </label>
      <input
        className="mx-1 mt-0.5 mb-2 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-md ps-1"
        id={id}
        {...props}
      />
    </>
  );
};

export default InputForm;
