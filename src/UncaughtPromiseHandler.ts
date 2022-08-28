import { errorDialog } from "./ui/React/DialogBox";

export function setupUncaughtPromiseHandler(): void {
  window.addEventListener("unhandledrejection", (e) =>
    errorDialog(e.reason, "UNCAUGHT PROMISE ERROR\nYou forgot to await a promise\nmaybe hack / grow / weaken ?\n"),
  );
}
