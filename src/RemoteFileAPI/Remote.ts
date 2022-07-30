import { RFALogger } from "./RFALogger";
import { RFAMessage } from "./MessageDefinitions"
import { RFARequestHandler } from "./MessageHandlers";

export class Remote {
    connection? : WebSocket;
    protocol = "ws";
    ipaddr: string;
    port: number;

    constructor(ip : string, port : number) {
        this.ipaddr = ip;
        this.port = port;
    }

    public startConnection() : void {
        this.startConnectionRecurse(1, 5);
    }

    handleCloseEvent():void {
        delete this.connection;
        RFALogger.log("Connection closed.");
    }

    startConnectionRecurse(retryN : number, retryMax : number) : void {
        RFALogger.log("Trying to connect.");
        this.connection = new WebSocket(this.protocol + "://" + this.ipaddr + ":" + this.port);

        this.connection.addEventListener("error", (e:Event) => {
            if(!this.connection) return;

            // When having trouble connecting, try again.
            if (this.connection.readyState === 3) {
                RFALogger.log(`Connection lost, retrying (try #${retryN}).`);
                if (retryN <= retryMax) this.startConnectionRecurse(retryN + 1, retryMax);
                return;
            }

            // Else handle the error normally
            RFALogger.error(e);
        });

        this.connection.addEventListener("message", handleMessageEvent);
        this.connection.addEventListener("open", () => RFALogger.log("Connection established: ", this.ipaddr, ":", this.port));
        this.connection.addEventListener("close", this.handleCloseEvent);
    }
}

function handleMessageEvent(e: MessageEvent):void {
        const msg : RFAMessage = JSON.parse(e.data);
        RFALogger.log("Message received:", msg);

        //TODO: Needs more safety, send error on invalid input, send error when msg.method isn´t in handlers, ...

        if (msg.method)
        {
            const response = RFARequestHandler[msg.method](msg);
            RFALogger.log("Sending response: ", response);
            if(response) this.send(JSON.stringify(response));
        }

        else if (msg.result) RFALogger.error("Result handling not implemented yet.");
        else if (msg.error) RFALogger.error("Received an error from server", msg);
        else RFALogger.error("Incorrect Message", msg);
}
