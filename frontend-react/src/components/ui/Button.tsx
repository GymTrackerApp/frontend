import clsx from "clsx";
import type React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  btnStyle: "approve" | "cancel" | "details" | "options";
  size: "small" | "medium" | "big";
  children: React.ReactNode;
  additionalStyle?: string;
}

const Button = ({
  btnStyle,
  size,
  children,
  additionalStyle,
  ...props
}: ButtonProps) => {
  let typeStyle;
  if (btnStyle === "approve") {
    typeStyle = "bg-blue-500 hover:bg-blue-400 transition-colors";
  } else if (btnStyle === "details") {
    typeStyle =
      "border border-blue-400 text-blue-400 hover:border-blue-300 hover:text-blue-300 transition-colors";
  } else if (btnStyle === "cancel") {
    typeStyle =
      "border border-gray-400 text-gray-400 hover:text-gray-300 transition-colors";
  } else if (btnStyle === "options") {
    typeStyle =
      "w-full border border-gray-500 hover:text-gray-300 hover:border-gray-400 justify-between! transition-colors";
  }

  let sizeStyle;
  if (size === "small") {
    sizeStyle = "py-0 px-2";
  } else if (size === "medium") {
    sizeStyle = "py-1 px-2";
  } else if (size === "big") {
    sizeStyle = "py-2 px-2";
  }

  const finalStyle = clsx(
    "flex justify-center items-center gap-2 cursor-pointer",
    typeStyle,
    additionalStyle,
    sizeStyle
  );

  return (
    <button className={finalStyle} {...props}>
      {children}
    </button>
  );
};

export default Button;
