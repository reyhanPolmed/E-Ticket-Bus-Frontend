export interface Notification {
  id: string
  message: string
  type: "success" | "error" | "info"
}

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastState {
  show: boolean;
  message: string;
  type: ToastType;
}

export interface UIState {
  modals: Record<string, boolean>
  notifications: Notification[]
  loading: Record<string, boolean>
  theme: "light" | "dark"
  toast: ToastState
}
