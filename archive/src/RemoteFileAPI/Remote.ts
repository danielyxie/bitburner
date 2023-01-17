import { RFAMessage } from "./MessageDefinitions";
import { RFARequestHandler } from "./MessageHandlers";
import { SnackbarEvents, ToastVariant } from "../ui/React/Snackbar";

export class Remote {
  connection?: WebSocket;
  static protocol = "ws";
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
    const address = Remote.protocol + "://" + this.ipaddr + ":" + this.port;
    this.connection = new WebSocket(address);

    this.connection.addEventListener("error", (e: Event) =>
      SnackbarEvents.emit(`Error with websocket ${address}, details: ${JSON.stringify(e)}`, ToastVariant.ERROR, 5000),
    );
    this.connection.addEventListener("message", handleMessageEvent);
    this.connection.addEventListener("open", () =>
      SnackbarEvents.emit(
        `Remote API connection established on ${this.ipaddr}:${this.port}`,
        ToastVariant.SUCCESS,
        2000,
      ),
    );
    this.connection.addEventListener("close", () =>
      SnackbarEvents.emit("Remote API connection closed", ToastVariant.WARNING, 2000),
    );
  }
}

function handleMessageEvent(this: WebSocket, e: MessageEvent): void {
  const msg: RFAMessage = JSON.parse(e.data);

  if (!msg.method || !RFARequestHandler[msg.method]) {
    const response = new RFAMessage({ error: "Unknown message received", id: msg.id });
    this.send(JSON.stringify(response));
    return;
  }
  const response = RFARequestHandler[msg.method](msg);
  if (!response) return;
  this.send(JSON.stringify(response));
}
