import { dialogBoxCreate } from "../DialogBox";

interface IError {
    fileName?: string,
    lineNumber?: number,
}

export function exceptionAlert(e: IError): void {
    dialogBoxCreate("Caught an exception: " + e + "<br><br>" +
                    "Filename: " + (e.fileName || "UNKNOWN FILE NAME") + "<br><br>" +
                    "Line Number: " + (e.lineNumber || "UNKNOWN LINE NUMBER") + "<br><br>" +
                    "This is a bug, please report to game developer with this " +
                    "message as well as details about how to reproduce the bug.<br><br>" +
                    "If you want to be safe, I suggest refreshing the game WITHOUT saving so that your " +
                    "safe doesn't get corrupted", false);
}
