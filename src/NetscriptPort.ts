import { Settings } from "./Settings/Settings";

type PortData = string | number;
type Resolver = () => void;
export interface IPort {
  write: (value: unknown) => PortData | null;
  tryWrite: (value: unknown) => boolean;
  read: () => PortData;
  peek: () => PortData;
  nextWrite: () => Promise<void>;
  full: () => boolean;
  empty: () => boolean;
  clear: () => void;
}

export function NetscriptPort(): IPort {
  const data: PortData[] = [];
  const resolvers: Resolver[] = [];

  return {
    write: (value) => {
      if (typeof value !== "number" && typeof value !== "string") {
        throw new Error(
          `port.write: Tried to write type ${typeof value}. Only string and number types may be written to ports.`,
        );
      }
      data.push(value);
      while (resolvers.length > 0) {
        (resolvers.pop() as Resolver)();
      }
      if (data.length > Settings.MaxPortCapacity) {
        return data.shift() as PortData;
      }
      return null;
    },

    tryWrite: (value) => {
      if (typeof value != "number" && typeof value != "string") {
        throw new Error(
          `port.write: Tried to write type ${typeof value}. Only string and number types may be written to ports.`,
        );
      }
      if (data.length >= Settings.MaxPortCapacity) {
        return false;
      }
      data.push(value);
      while (resolvers.length > 0) {
        (resolvers.pop() as Resolver)();
      }
      return true;
    },

    read: () => {
      if (data.length === 0) return "NULL PORT DATA";
      return data.shift() as PortData;
    },

    peek: () => {
      if (data.length === 0) return "NULL PORT DATA";
      return data[0];
    },

    nextWrite: () => {
      return new Promise((res) => resolvers.push(res));
    },

    full: () => {
      return data.length == Settings.MaxPortCapacity;
    },

    empty: () => {
      return data.length === 0;
    },

    clear: () => {
      data.length = 0;
    },
  };
}
