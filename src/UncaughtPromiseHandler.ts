import { isScriptErrorMessage } from "./NetscriptEvaluator";
import { dialogBoxCreate } from "./ui/React/DialogBox";

export function setupUncaughtPromiseHandler(): void {
  window.addEventListener("unhandledrejection", function (e) {
    if (isScriptErrorMessage(e.reason)) {
      const errorTextArray = e.reason.split("|DELIMITER|");
      const hostname = errorTextArray[1];
      const scriptName = errorTextArray[2];
      const errorMsg = errorTextArray[3];

      let msg = `UNCAUGHT PROMISE ERROR<br>You forgot to await a promise<br>${scriptName}@${hostname}<br>`;
      msg += "<br>";
      msg += errorMsg;
      dialogBoxCreate(msg);
    }
  });
}
