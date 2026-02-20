import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../features/hooks";
import { hideToast } from "../features/ui/uiSlice";

const iconMap: Record<string, string> = {
    success: "check_circle",
    error: "error",
    warning: "warning",
    info: "info",
};

const colorMap: Record<string, { bg: string; border: string; text: string; icon: string; progress: string }> = {
    success: {
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-800",
        icon: "text-green-500",
        progress: "bg-green-500",
    },
    error: {
        bg: "bg-red-50",
        border: "border-red-200",
        text: "text-red-800",
        icon: "text-red-500",
        progress: "bg-red-500",
    },
    warning: {
        bg: "bg-amber-50",
        border: "border-amber-200",
        text: "text-amber-800",
        icon: "text-amber-500",
        progress: "bg-amber-500",
    },
    info: {
        bg: "bg-blue-50",
        border: "border-blue-200",
        text: "text-blue-800",
        icon: "text-blue-500",
        progress: "bg-blue-500",
    },
};

const TOAST_DURATION = 4000;

const Toast: React.FC = () => {
    const dispatch = useAppDispatch();
    const { show, message, type } = useAppSelector((state) => state.ui.toast);
    const [visible, setVisible] = useState(false);
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        if (show) {
            setVisible(true);
            setProgress(100);

            const startTime = Date.now();
            const interval = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const remaining = Math.max(0, 100 - (elapsed / TOAST_DURATION) * 100);
                setProgress(remaining);
                if (remaining <= 0) {
                    clearInterval(interval);
                }
            }, 30);

            const timer = setTimeout(() => {
                setVisible(false);
                setTimeout(() => dispatch(hideToast()), 300);
            }, TOAST_DURATION);

            return () => {
                clearTimeout(timer);
                clearInterval(interval);
            };
        }
    }, [show, message, type, dispatch]);

    const handleClose = () => {
        setVisible(false);
        setTimeout(() => dispatch(hideToast()), 300);
    };

    if (!show) return null;

    const colors = colorMap[type] || colorMap.info;

    return (
        <div className="fixed top-6 right-6 z-[9999] font-display" style={{ pointerEvents: "auto" }}>
            <div
                className={`
          flex items-start gap-3 px-5 py-4 rounded-xl shadow-lg border
          ${colors.bg} ${colors.border}
          min-w-[320px] max-w-[420px]
          transition-all duration-300 ease-out overflow-hidden
          ${visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
        `}
            >
                {/* Icon */}
                <span className={`material-symbols-outlined !text-2xl mt-0.5 ${colors.icon}`}>
                    {iconMap[type]}
                </span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${colors.text} capitalize mb-0.5`}>
                        {type}
                    </p>
                    <p className={`text-sm ${colors.text} opacity-90 leading-relaxed`}>
                        {message}
                    </p>
                </div>

                {/* Close */}
                <button
                    onClick={handleClose}
                    className={`${colors.text} opacity-60 hover:opacity-100 transition-opacity mt-0.5 flex-shrink-0`}
                >
                    <span className="material-symbols-outlined !text-xl">close</span>
                </button>

                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/5 rounded-b-xl overflow-hidden">
                    <div
                        className={`h-full ${colors.progress} transition-all duration-100 ease-linear rounded-b-xl`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Toast;
