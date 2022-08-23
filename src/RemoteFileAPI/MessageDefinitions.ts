export class RFAMessage {
  jsonrpc = "2.0"; // Transmits version of JSON-RPC. Compliance maybe allows some funky interaction with external tools?
  public method?: string; // Is defined when it's a request/notification, otherwise undefined
  public result?: string | number; // Is defined when it's a response, otherwise undefined
  public params?: FileMetadata; // Optional parameters to method
  public error?: string; // Only defined on error
  public id?: number; // ID to keep track of request -> response interaction, undefined with notifications, defined with request/response

  constructor(
    obj: { method?: string; result?: string | number; params?: FileMetadata; error?: string; id?: number } = {},
  ) {
    this.method = obj.method;
    this.result = obj.result;
    this.params = obj.params;
    this.error = obj.error;
    this.id = obj.id;
  }
}

type FileMetadata = FileData | FileContent | FileLocation | FileServer;

export interface FileData {
  filename: string;
  content: string;
  server: string;
}

export interface FileContent {
  filename: string;
  content: string;
}

export interface FileLocation {
  filename: string;
  server: string;
}

export interface FileServer {
  server: string;
}

export function isFileData(p: unknown): p is FileData {
  const pf = p as FileData;
  return typeof pf.server === "string" && typeof pf.filename === "string" && typeof pf.content === "string";
}

export function isFileLocation(p: unknown): p is FileLocation {
  const pf = p as FileLocation;
  return typeof pf.server === "string" && typeof pf.filename === "string";
}

export function isFileContent(p: unknown): p is FileContent {
  const pf = p as FileContent;
  return typeof pf.filename === "string" && typeof pf.content === "string";
}

export function isFileServer(p: unknown): p is FileServer {
  const pf = p as FileServer;
  return typeof pf.server === "string";
}
