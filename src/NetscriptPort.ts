import { Settings } from "./Settings/Settings";

export interface IPort {
  write: (value: any) => any;
  tryWrite: (value: any) => boolean;
  read: () => any;
  peek: () => any;
  full: () => boolean;
  empty: () => boolean;
  clear: () => void;
}

export function NetscriptPort(): IPort {
  const data: unknown[] = [];

  return {
    write: (value: unknown): unknown => {
      data.push(value);
      if (data.length > Settings.MaxPortCapacity) {
        return data.shift();
      }
      return null;
    },

    tryWrite: (value: unknown): boolean => {
      if (data.length >= Settings.MaxPortCapacity) {
        return false;
      }
      data.push(value);
      return true;
    },

    read: (): unknown => {
      if (data.length === 0) {
        return "NULL PORT DATA";
      }
      return data.shift();
    },

    peek: (): unknown => {
      if (data.length === 0) {
        return "NULL PORT DATA";
      } else {
        const foo = data.slice();
        return foo[0];
      }
    },

    full: (): boolean => {
      return data.length == Settings.MaxPortCapacity;
    },

    empty: (): boolean => {
      return data.length === 0;
    },

    clear: (): void => {
      data.length = 0;
    },
  };
}
