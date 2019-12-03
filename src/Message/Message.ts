import { Generic_fromJSON,
         Generic_toJSON,
         Reviver } from "../../utils/JSONReviver";

export class Message {
    // Initializes a Message Object from a JSON save state
    static fromJSON(value: any): Message {
        return Generic_fromJSON(Message, value.data);
    }

    // Name of Message file
    filename: string = "";

    // The text contains in the Message
    msg: string = "";

    // Flag indicating whether this Message has been received by the player
    recvd: boolean = false;

    constructor(filename= "", msg= "") {
        this.filename   = filename;
        this.msg        = msg;
        this.recvd      = false;
    }

    // Serialize the current object to a JSON save state
    toJSON(): any {
        return Generic_toJSON("Message", this);
    }
}

Reviver.constructors.Message = Message;
