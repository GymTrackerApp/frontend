interface ExitApproveActionButtonsProps {
  cancelButtonText?: string;
  saveButtonText?: string;
  onCancel: () => void;
}

const ExitApproveActionButtons = ({
  cancelButtonText = "Cancel",
  saveButtonText = "Save",
  onCancel,
}: ExitApproveActionButtonsProps) => {
  const cancelButtonStyle =
    "bg-gray-700 px-3 rounded-xl w-full text-blue-500 border-2 border-blue-500 cursor-pointer";
  const approveButtonStyle =
    "bg-blue-500 px-3 rounded-xl w-full cursor-pointer";

  return (
    <div className="flex justify-between gap-3">
      <button
        className={cancelButtonStyle}
        onClick={onCancel}
        customType="button"
      >
        {cancelButtonText}
      </button>
      <button className={approveButtonStyle} customType="submit">
        {saveButtonText}
      </button>
    </div>
  );
};

export default ExitApproveActionButtons;
