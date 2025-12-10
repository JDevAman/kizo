import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { removeToast } from "../../store/slices/uiSlice";
import { X } from "lucide-react";
import { cn } from "../../utils/utils";

export function ReduxToast() {
  const toasts = useAppSelector((state) => state.ui.toasts);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Auto dismiss after 3 seconds
    toasts.forEach((t) => {
      if (t) {
        const timer = setTimeout(() => dispatch(removeToast(t.id)), 5000);
        return () => clearTimeout(timer);
      }
    });
  }, [toasts, dispatch]);

  if (!toasts.length) return null;

  return (
    <div className="fixed top-4 right-4 flex flex-col gap-2 z-50">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "relative flex w-full max-w-sm items-start justify-between gap-4 rounded-md border p-4 shadow-lg transition-all",
            t.variant === "destructive"
              ? "bg-red-600 text-white border-red-700"
              : "bg-gray-800 text-white border-gray-700"
          )}
        >
          <div className="flex-1">
            {t.title && <p className="font-semibold">{t.title}</p>}
            {t.description && (
              <p className="text-sm text-gray-300">{t.description}</p>
            )}
          </div>
          <button
            onClick={() => dispatch(removeToast(t.id))}
            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
