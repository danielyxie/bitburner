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
  const data: any[] = [];

  return {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    write: (value: any): any => {
      data.push(value);
      if (data.length > Settings.MaxPortCapacity) {
        return data.shift();
      }
      return null;
    },

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    tryWrite: (value: any): boolean => {
      if (data.length >= Settings.MaxPortCapacity) {
        return false;
      }
      data.push(value);
      return true;
    },

    read: (): any => {
      if (data.length === 0) {
        return "NULL PORT DATA";
      }
      return data.shift();
    },

    peek: (): any => {
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
