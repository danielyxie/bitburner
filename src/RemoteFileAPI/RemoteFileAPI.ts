import { Settings } from "../Settings/Settings";
import { Remote } from "./Remote";

let server: Remote;

export function newRemoteFileApiConnection(): void {
  if (server) server.stopConnection();
  server = new Remote("localhost", Settings.RemoteFileApiPort);
  server.startConnection();
}

export function isRemoteFileApiConnectionLive(): boolean {
  return server.connection != undefined && server.connection.readyState == 1;
}
