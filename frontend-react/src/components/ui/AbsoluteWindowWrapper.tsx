import clsx from "clsx";
import React, { useEffect } from "react";

interface AbsoluteWindowWrapperProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  windowSize?: "small" | "medium" | "large";
}

const AbsoluteWindowWrapper = ({
  children,
  isOpen,
  onClose,
  windowSize,
}: AbsoluteWindowWrapperProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed flex justify-center items-center top-0 left-0 right-0 bottom-0 bg-black/50 z-50"
      onClick={onClose}
    >
      <div
        className={clsx(
          "bg-components-main p-3 rounded-md max-h-[90vh] overflow-y-auto scrollbar-none",
          {
            "w-1/4": windowSize === "small",
            "w-1/2": windowSize === "medium" || !windowSize,
            "w-3/4": windowSize === "large",
          }
        )}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default AbsoluteWindowWrapper;
