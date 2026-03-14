import { useEffect } from "react";

const Modal = ({ open, onClose, title, children, size = "md" }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose(); // only close on backdrop
      }}
    >
      <div
        className={`bg-white rounded-xl shadow-lg w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto p-6`}
      >
        <div className="flex justify-between items-center mb-4">
          { title  ? <h2 className="text-xl font-bold">{title}</h2> : <div></div>}
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            ✕
          </button>
        </div>
        <div>{children}</div>
        <div className="w-full h-4"> </div>
      </div>
    </div>
  );
};

export default Modal;
