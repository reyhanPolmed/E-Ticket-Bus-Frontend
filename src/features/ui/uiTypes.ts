export interface Notification {
  id: string
  message: string
  type: "success" | "error" | "info"
}

export interface UIState {
  modals: Record<string, boolean>
  notifications: Notification[]
  loading: Record<string, boolean>
  theme: "light" | "dark"
}
