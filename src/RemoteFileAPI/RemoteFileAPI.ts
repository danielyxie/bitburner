import { Remote }  from "./Remote";

class RemoteFileAPI {
    server : Remote;

    constructor(){
        this.server = new Remote("localhost", 12525);
        return;
    }

    enable() : void {
        this.server.startConnection();
    }
}

export const RFA = new RemoteFileAPI;
