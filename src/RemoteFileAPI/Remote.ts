import { RFALogger } from "./RFALogger";
import { RFAMessage } from "./MessageDefinitions";
import { RFARequestHandler } from "./MessageHandlers";

export class Remote {
  connection?: WebSocket;
  protocol = "ws";
  ipaddr: string;
  port: number;

  constructor(ip: string, port: number) {
    this.ipaddr = ip;
    this.port = port;
  }

  public stopConnection(): void {
    this.connection?.close();
  }

  public startConnection(): void {
    RFALogger.log("Trying to connect.");
    this.connection = new WebSocket(this.protocol + "://" + this.ipaddr + ":" + this.port);

    this.connection.addEventListener("error", (e: Event) => RFALogger.error(e));
    this.connection.addEventListener("message", handleMessageEvent);
    this.connection.addEventListener("open", () =>
      RFALogger.log("Connection established: ", this.ipaddr, ":", this.port),
    );
    this.connection.addEventListener("close", () => RFALogger.log("Connection closed"));
  }
}

function handleMessageEvent(this: WebSocket, e: MessageEvent): void {
  const msg: RFAMessage = JSON.parse(e.data);
  RFALogger.log("Message received:", msg);

  if (msg.method) {
    if (!RFARequestHandler[msg.method]) {
      const response = new RFAMessage({ error: "Unknown message received", id: msg.id });
      this.send(JSON.stringify(response));
      return;
    }
    const response = RFARequestHandler[msg.method](msg);
    RFALogger.log("Sending response: ", response);
    if (response) this.send(JSON.stringify(response));
  } else if (msg.result) RFALogger.log("Somehow retrieved a result message.");
  else if (msg.error) RFALogger.error("Received an error from server", msg);
  else RFALogger.error("Incorrect Message", msg);
}
