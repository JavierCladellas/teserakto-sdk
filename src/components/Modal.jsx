import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const Modal = ({ open, onClose, title, children, size }) => {
    const backdropRef = useRef(null);

    const sizeClasses = {
        sm: "max-w-md",
        md: "max-w-2xl",
        lg: "max-w-4xl",
        xl: "max-w-6xl",
    };

    useEffect(() => {
        if (!open) return;

        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [open, onClose]);

    const handleBackdropClick = (e) => {
        if (e.target === backdropRef.current) {
            onClose();
        }
    };

    const modalContent = (
        <AnimatePresence>
            {open && (
                <motion.div 
                    ref={backdropRef}
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }} 
                    onMouseDown={handleBackdropClick}
                    // 🚨 Portal protection added here
                    className="teserakto-container box-border fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-[100] p-2 sm:p-6"
                >
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }} 
                        animate={{ scale: 1, opacity: 1 }} 
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        // 🚨 Box-border protection added here
                        className={`box-border bg-white w-full rounded-2xl shadow-xl p-4 sm:p-6 overflow-y-auto max-h-[95vh] min-h-[30vh] flex flex-col ${sizeClasses[size || "md"]}`}
                    >
                        <div className="flex justify-between items-center mb-4 gap-2 flex-shrink-0">
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 break-words">
                                {title}
                            </h2>
                            <button 
                                onClick={onClose} 
                                className="text-gray-400 hover:text-gray-700 text-xl appearance-none border-none bg-transparent cursor-pointer" 
                            >
                                ✕
                            </button>
                        </div>
                        {/* 🚨 Your children are back! */}
                        <div className="flex-1 min-h-0 overflow-hidden">
                            {children}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    if (typeof document === "undefined") return null;

    return createPortal(modalContent, document.body);
};

export default Modal;