import { Settings } from "../Settings/Settings";
import { Remote } from "./Remote";

let server: Remote;

export function newRemoteFileApiConnection(): void {
  if (server) server.stopConnection();
  if (Settings.RemoteFileApiPort === 0) return;
  server = new Remote("localhost", Settings.RemoteFileApiPort);
  server.startConnection();
}

export function isRemoteFileApiConnectionLive(): boolean {
  return server && server.connection != undefined && server.connection.readyState == 1;
}
