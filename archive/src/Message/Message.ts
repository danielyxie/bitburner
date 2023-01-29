import { MessageFilenames } from "./MessageHelpers";

export class Message {
  // Name of Message file
  filename: MessageFilenames;

  // The text contains in the Message
  msg: string;

  constructor(filename: MessageFilenames, msg: string) {
    this.filename = filename;
    this.msg = msg;
  }
}
