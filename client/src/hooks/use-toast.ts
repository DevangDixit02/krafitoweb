"use client";

import { toast as sonnerToast } from "sonner";

export function useToast() {
  return {
    success: (message: string) =>
      sonnerToast.success(message, {
        style: { background: "#D1FAE5", color: "#065F46" },
      }),
    error: (message: string) =>
      sonnerToast.error(message, {
        style: { background: "#FECACA", color: "#7F1D1D" },
      }),
    warning: (message: string) =>
      sonnerToast.warning(message, {
        style: { background: "#FEF08A", color: "#92400E" },
      }),
    info: (message: string) =>
      sonnerToast(message, {
        style: { background: "#BFDBFE", color: "#1E40AF" },
      }),
  };
}

export { sonnerToast as toast };
