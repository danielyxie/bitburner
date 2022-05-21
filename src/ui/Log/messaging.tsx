export type ICrossWindowMessage<T> = T & { messageType: "Bitburner" };

export function makeMessage<T>(message: T): ICrossWindowMessage<T> {
  return { messageType: "Bitburner", ...message };
}

export function retrieveMessage<T>(message: unknown): T | undefined {
  // @ts-ignore
  if (!message || message.messageType !== "Bitburner") return;
  return message as T;
}

export interface ICrossWindowMessageUpdate {
  filename: string;
  args: any[];
  running: boolean;
  logs: string[];
}

export interface ICrossWindowMessageCommand {
  command: "run" | "kill" | "close";
}
