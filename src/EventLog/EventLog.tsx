import React from "react";
import { ISelfInitializer, ISelfLoading } from "../types";

import { Settings } from "../Settings/Settings";
import { SourceFiles } from "../SourceFile/SourceFiles";
import { Router } from "../ui/GameRoot";
import { achievements } from "../Achievements/Achievements";

import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoIcon from "@mui/icons-material/Info";

import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"; // Achievements
import StarsIcon from "@mui/icons-material/Stars"; // Prestige
import CodeIcon from "@mui/icons-material/Code"; // ScriptError
import WorkIcon from "@mui/icons-material/Work"; // Jobs
import GroupsIcon from "@mui/icons-material/Groups"; // Gangs
import BugReportIcon from "@mui/icons-material/BugReport"; // Game Error

export enum LogTypes {
  Info,
  Error,
  Warning,
  Success,
}

export enum LogCategories {
  Misc,
  ScriptError,
  Achievement,
  GameError,
  Prestige,
  Gangs,
  Jobs,
}

export interface LogEntryOptions {
  description?: string;
  type?: LogTypes;
  category?: LogCategories;
  linkIdentifier?: any;
}

export interface LogEntry {
  message: string;
  timestamp: number;
  description?: string;
  type: LogTypes;
  category: LogCategories;
  seen?: boolean;
  linkIdentifier?: any;
}

export interface DetailedLogEntry extends Omit<LogEntry, "description"> {
  icon: React.ReactNode;
  description?: React.ReactNode | string | undefined;
  logKey: string;
  actionHandler: (key?: any) => void;
}

export interface IEventLog {
  addItem(message: string, options?: LogEntryOptions): void;
  getEntries: () => LogEntry[];
  getDetailedEntries: () => DetailedLogEntry[];
  getEventLogUpdatedOn(): number;
  getNumberUnseen(): number;
  markAsSeen(): void;
}

class EventLogManager implements IEventLog, ISelfInitializer, ISelfLoading {
  private logEntries: LogEntry[];
  private eventLogUpdatedOn: number;

  constructor() {
    this.logEntries = [];
    this.eventLogUpdatedOn = new Date().getTime();
  }

  addItem(message: string, options?: LogEntryOptions): void {
    const e: LogEntry = {
      timestamp: new Date().getTime(),
      message: message,
      category: options?.category ?? LogCategories.Misc,
      type: options?.type ?? LogTypes.Error,
      description: options?.description,
      linkIdentifier: options?.linkIdentifier,
    };
    try {
      this.logEntries = [e, ...this.logEntries].slice(0, Settings.MaxEventLogCapacity);
      this.eventLogUpdatedOn = new Date().getTime();
    } catch (ex) {
      console.error(ex);
    }
  }

  getEntries(): LogEntry[] {
    return this.logEntries;
  }

  getDetailedEntries(): DetailedLogEntry[] {
    return this.getEntries().map((log) => {
      const icon = getLogIcon(log);
      const actionHandler = getLogAction(log);
      const detailed: DetailedLogEntry = {
        ...log,
        icon,
        actionHandler,
        description: getLogDescription(log),
        logKey: `log_${log.timestamp}_${log.category}_${log.type}`,
      };
      return detailed;
    });
  }

  getEventLogUpdatedOn(): number {
    return this.eventLogUpdatedOn;
  }

  clear(): void {
    this.logEntries = [];
    this.eventLogUpdatedOn = new Date().getTime();
  }

  setEntries(entries: LogEntry[]): void {
    this.logEntries = entries;
  }

  private getUnseen(): LogEntry[] {
    return this.logEntries.filter((e) => !e.seen);
  }

  getNumberUnseen(): number {
    return this.getUnseen().length;
  }

  markAsSeen(): void {
    this.getUnseen().forEach((e) => (e.seen = true));
  }

  init(): void {
    Object.assign(this, new EventLogManager());
  }

  load(saveString: string): void {
    const save = JSON.parse(saveString);
    Object.assign(this, save);
  }
}

function getLogIcon(log: LogEntry): React.ReactNode {
  let color = Settings.theme.primary;
  let IconComponent;
  switch (log.type) {
    case LogTypes.Error:
      color = Settings.theme.error;
      IconComponent = ErrorIcon;
      break;
    case LogTypes.Success:
      color = Settings.theme.success;
      IconComponent = CheckCircleIcon;
      break;
    case LogTypes.Warning:
      color = Settings.theme.warning;
      IconComponent = WarningIcon;
      break;
    case LogTypes.Info:
      color = Settings.theme.info;
      IconComponent = InfoIcon;
      break;
  }

  switch (log.category) {
    case LogCategories.Achievement:
      IconComponent = EmojiEventsIcon;
      break;
    case LogCategories.ScriptError:
      IconComponent = CodeIcon;
      break;
    case LogCategories.GameError:
      IconComponent = BugReportIcon;
      break;
    case LogCategories.Prestige:
      IconComponent = StarsIcon;
      break;
    case LogCategories.Gangs:
      IconComponent = GroupsIcon;
      break;
    case LogCategories.Jobs:
      IconComponent = WorkIcon;
      break;
  }

  return <IconComponent sx={{ color: color }} />;
}

function getLogAction(log: LogEntry): () => void | null {
  let handler;
  switch (log.category) {
    case LogCategories.Achievement:
      handler = () => Router.toAchievements();
      break;
  }
  return handler as () => void | null;
}

function getLogDescription(log: LogEntry): React.ReactNode | string | undefined {
  if (log.description) return log.description;
  if (!log.linkIdentifier) return;
  switch (log.category) {
    case LogCategories.Achievement:
      return achievements[log.linkIdentifier]?.Description;
    case LogCategories.Prestige:
      if (log.linkIdentifier.startsWith("SourceFile")) {
        return SourceFiles[log.linkIdentifier]?.info;
      }
  }
  return;
}

export const getDummyData = (): LogEntry[] => [
  {
    timestamp: new Date().getTime(),
    type: LogTypes.Error,
    category: LogCategories.ScriptError,
    message: "Oh No! This is bad!",
    description: `
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ut iaculis libero. Ut feugiat, nisl vitae ornare hendrerit, turpis ante mollis sapien, vitae facilisis ipsum ex non ante. Nam ac neque purus. Fusce vulputate faucibus purus vitae bibendum. Vestibulum ut justo nec nisl dapibus maximus. Sed sit amet ultricies felis, at pretium sem. Nam molestie lobortis dolor et convallis. Nulla suscipit ante magna, a dapibus purus tincidunt efficitur. Cras hendrerit nunc eu dictum aliquam. In in consectetur massa. Curabitur eu eros lobortis, eleifend tellus iaculis, malesuada ipsum. Mauris egestas efficitur leo, eu dictum ante suscipit sit amet. Nulla efficitur fringilla massa, nec rutrum sapien mollis id. Vivamus quis faucibus odio.
      <br />
      <br />
      <br />
      <strong style="color: red">Lorem Ipsum</strong> dolor sit amet.
    `,
  },
  {
    timestamp: new Date().getTime() - 2344,
    type: LogTypes.Success,
    category: LogCategories.Achievement,
    message: "Yay! You got an achievement!",
    description: "You're so cool! Good job!",
  },
  {
    timestamp: new Date().getTime() - 98273,
    type: LogTypes.Error,
    category: LogCategories.Misc,
    message: "This is a miscellaneous error.",
  },
  {
    timestamp: new Date().getTime() - 9283498,
    type: LogTypes.Warning,
    category: LogCategories.Misc,
    message: "WARNING WARNING SOMETHING OCCURED",
  },
  {
    timestamp: new Date().getTime() - 832748234,
    type: LogTypes.Success,
    category: LogCategories.Misc,
    message: "Oh Yes! Sucess!",
  },
  {
    timestamp: new Date().getTime() - 2938849389,
    type: LogTypes.Info,
    category: LogCategories.Misc,
    message: "Boring information goes here.",
  },
];

const instance = new EventLogManager();
export const EventLog = instance as IEventLog;
export const EventLogObject = instance;
