import { dialogBoxCreate } from "../../ui/React/DialogBox";

interface IError {
  fileName?: string;
  lineNumber?: number;
}

export function exceptionAlert(e: IError | string): void {
  console.error(e);
  let msg = "";
  let file = "UNKNOWN FILE NAME";
  let line = "UNKNOWN LINE NUMBER";
  const isError = (e: IError | string): e is IError => e.hasOwnProperty("fileName");
  if (isError(e)) {
    file = e.fileName ?? file;
    line = e.lineNumber?.toString() ?? line;
  } else {
    msg = e;
  }
  dialogBoxCreate(
    "Caught an exception: " +
      msg +
      "<br><br>" +
      "Filename: " +
      file +
      "<br><br>" +
      "Line Number: " +
      line +
      "<br><br>" +
      "This is a bug, please report to game developer with this " +
      "message as well as details about how to reproduce the bug.<br><br>" +
      "If you want to be safe, I suggest refreshing the game WITHOUT saving so that your " +
      "save doesn't get corrupted",
  );
}
