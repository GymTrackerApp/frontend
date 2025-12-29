import React, { useEffect } from "react";

interface AbsoluteWindowWrapperProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const AbsoluteWindowWrapper = ({
  children,
  isOpen,
  onClose,
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
      className="fixed flex justify-center items-center top-0 left-0 right-0 bottom-0 bg-black/25"
      onClick={onClose}
    >
      <div
        className="w-1/2 bg-gray-600 p-3 rounded-md"
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
