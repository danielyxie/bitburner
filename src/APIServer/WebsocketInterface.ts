import logger from './SocketLogs';
import APIServerConfiguration from "./APIServerConfiguration";

import {CLIENT_EVENTS, SERVER_EVENTS} from './APIServerEvents';

interface WebsocketMessage<T> {
    type:string;
    action:string;
    token:string;
    payload?:T;
}

export interface WebsocketEvent {
    action:string;
    payload:string;
}

class WebSocketInterface extends EventTarget {
    _enabled: boolean;
    _connected = false;
    _socket: WebSocket | undefined;
    _sessionToken = "";
    _authenticated = false;
    _host = "localhost";
    _port = 9991;
    _protocol:"ws"|"wss" = "ws";

    constructor() {
        super();
        this._enabled = false;
        if (APIServerConfiguration.autostart) {
            console.log(`[Websocket] Autostart Enabled`);
            this.start();
        }
    }
    initialize = ():void => {
        const win = (window as any);
        if (!win._APIServer) {
            win._APIServer = {
                start: this.start,
                stop: this.stop,
                debug: (mode:boolean) => (mode ? logger.enable() : logger.disable()),
                autostart: (mode:boolean) => APIServerConfiguration.autostart = mode,
            }
        }
    }
    get connected():boolean {
        return this._connected && this._authenticated;
    }
    send<T>(type:string, action:string, payload:T):void {
        if (!CLIENT_EVENTS[type] || !CLIENT_EVENTS[type][action]) {
            logger.error(`[Websocket] Cannot send message. Invalid type '${type}' or action '${action}'`);
            return;
        }
        if (!this._connected) {
            logger.error(`[Websocket] Cannot sent message. Not connected to websocket server`);
            return;
        }

        const data:WebsocketMessage<T> = {type, action, payload, token: this._sessionToken};

        if (this._socket?.readyState === 1) {
            this._socket?.send(JSON.stringify(data));
        } else {
            if (this._socket && this._socket.readyState > 1) {
                this._handleClose();
            }
            throw new Error("[Websocket] Connection is not open or has been closed");
        }
    }
    _handleOpen = ():void => {
        this._connected = true;
        logger.log("[Websocket] Open");
        this.send<{token:string}>("AUTH", "LOGIN", {token: APIServerConfiguration.authToken} );
    }
    _handleAuth = (token?:string):void => {
        if (!token){
            // Auth was unsuccessful
            this.stop();
            return;
        }
        this._sessionToken = token;
        this._authenticated = true;

        // We dont consider the socket connected until authenticated
        console.log("[Websocket] Connection is now ready.")
        this.dispatchEvent(new CustomEvent("CONNECTED"));
    }
    _handleClose = ():void => {
        delete this._socket;
        this._connected = false;
        this._authenticated = false;
        this._sessionToken = "";
    }
    _handleMessage = (e:MessageEvent):void => {
        try {
            const {payload, type, action}:WebsocketMessage<any> = JSON.parse(e.data);

            if (!SERVER_EVENTS[type] || !SERVER_EVENTS[type][action]) {
                logger.error(`[Websocket] Invalid type '${type}' or action '${action}'`);
                return;
            }
            logger.log(`[Websocket] Message - ${SERVER_EVENTS[type][action]}`, payload);

            if (type === "AUTH" && action === "TOKEN") {
                this._handleAuth(payload.token);
                return;
            }

            this.dispatchEvent(new CustomEvent(type, {
                detail: {
                    action,
                    payload
                }
            }));
        } catch (err) {
            logger.error("[Websocket] Unable to process message from server");
        }
    }
    _handleError(e:Event):void {
        logger.log("[Websocket] Error", e);
    }

    _startServer = ():void => {
        // If the server has been disabled, skip any connection attempts
        if (!this._enabled) {
            return;
        }
        console.log("[Websocket] Attempting to connect...");
        const connectionAttempt = new WebSocket(`${this._protocol}://${this._host}:${this._port}`);
        connectionAttempt.addEventListener("error", (e:Event) => {
            // We lost our connection, poll for the server
            if (connectionAttempt.readyState === 3) {
                console.log("[Websocket] Connection to server lost...reconnecting...");
                this._startServer();
                return;
            }

            // Else handle the error normally
            this._handleError(e);
        });
        connectionAttempt.addEventListener("message", this._handleMessage);
        connectionAttempt.addEventListener("open", (e:Event) => {
            this._socket = connectionAttempt;
            this._handleOpen(e);
        });
        connectionAttempt.addEventListener("close", this._handleClose);

        // Websocket timeouts are pretty long so we handle them ourselves
        setTimeout(() => {
            if (connectionAttempt.readyState === 0) {
                console.log("[Websocket] Unable to connect to server");
                connectionAttempt.close();
            }
        }, 2000);
    }
    start = (token?: string, options?:{host:string; port:number; secure:boolean}):void => {
        // Mantain this for attempting to reconnect
        this._enabled = true;

        if (options) {
            this._port = options.port || this._port;
            this._host = options.host || this._host;
            if (options.hasOwnProperty("secure")) {
                this._protocol = options.secure ? "wss" : "ws";
            }
        }

        // Use provided token or set a new one if passed in
        if (token) {
            APIServerConfiguration.authToken = token;
        }
        logger.log("Starting Websocket connection...");
        logger.log(`Token: ${APIServerConfiguration.authToken}`);

        this._startServer();
    }
    stop = async ():Promise<void> => {
        this._enabled = false;
        this._socket?.close();
    }
}
const WebSocketInterfaceSingleton = new WebSocketInterface();

export default WebSocketInterfaceSingleton;