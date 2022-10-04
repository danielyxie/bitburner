import React from "react";
import { Settings } from "../Settings/Settings";
import { formatTime } from "../utils/helpers/formatTime";
import { BaseServer } from "../Server/BaseServer";

export class Output {
  text: string;
  color: "primary" | "error" | "success" | "info" | "warn";
  constructor(text: string, color: "primary" | "error" | "success" | "info" | "warn") {
    if (Settings.TimestampsFormat) text = "[" + formatTime(Settings.TimestampsFormat) + "] " + text;
    this.text = text;
    this.color = color;
  }
}

export class RawOutput {
  raw: React.ReactNode;
  constructor(node: React.ReactNode) {
    if (Settings.TimestampsFormat)
      node = (
        <>
          [{formatTime(Settings.TimestampsFormat)}] {node}
        </>
      );
    this.raw = node;
  }
}

export class Link {
  hostname: string;
  dashes: string;
  constructor(dashes: string, hostname: string) {
    if (Settings.TimestampsFormat) dashes = "[" + formatTime(Settings.TimestampsFormat) + "] " + dashes;
    this.hostname = hostname;
    this.dashes = dashes;
  }
}

export class TTimer {
  time: number;
  timeLeft: number;
  action: "h" | "b" | "a" | "g" | "w";
  server?: BaseServer;

  constructor(time: number, action: "h" | "b" | "a" | "g" | "w", server?: BaseServer) {
    this.time = time;
    this.timeLeft = time;
    this.action = action;
    this.server = server;
  }
}
