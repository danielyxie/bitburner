import { handleUnknownError } from "./Netscript/NetscriptHelpers";

export function setupUncaughtPromiseHandler(): void {
  window.addEventListener("unhandledrejection", (e) => {
    e.preventDefault();
    handleUnknownError(
      e.reason,
      null,
      "UNCAUGHT PROMISE ERROR\nYou forgot to await a promise\nmaybe hack / grow / weaken ?\n\n",
    );
  });
}
