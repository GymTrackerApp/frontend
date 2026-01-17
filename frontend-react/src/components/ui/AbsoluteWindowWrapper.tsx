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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-background-dark w-1/2 max-h-[75vh] lg:w-full min-w-90 max-w-160 md:max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-border-dark"
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
