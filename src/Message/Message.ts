import { Reviver,
         Generic_toJSON,
         Generic_fromJSON } from "../../utils/JSONReviver";

export class Message {

    // Name of Message file
    filename = "";

    // The text contains in the Message
    msg = "";

    // Flag indicating whether this Message has been received by the player
    recvd = false;

    constructor(filename="", msg="") {
        this.filename   = filename;
        this.msg        = msg;
        this.recvd      = false;
    }

    // Serialize the current object to a JSON save state
    toJSON(): any {
        return Generic_toJSON("Message", this);
    }

    // Initializes a Message Object from a JSON save state
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    static fromJSON(value: any): Message {
        return Generic_fromJSON(Message, value.data);
    }
}

Reviver.constructors.Message = Message;
