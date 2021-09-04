import { Settings } from "./Settings/Settings";

export class NetscriptPort {
  data: any[] = [];

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  write(data: any): any {
    this.data.push(data);
    if (this.data.length > Settings.MaxPortCapacity) {
      return this.data.shift();
    }
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  tryWrite(data: any): boolean {
    if (this.data.length >= Settings.MaxPortCapacity) {
      return false;
    }
    this.data.push(data);
    return true;
  }

  read(): any {
    if (this.data.length === 0) {
      return "NULL PORT DATA";
    }
    return this.data.shift();
  }

  peek(): any {
    if (this.data.length === 0) {
      return "NULL PORT DATA";
    } else {
      const foo = this.data.slice();
      return foo[0];
    }
  }

  full(): boolean {
    return this.data.length == Settings.MaxPortCapacity;
  }

  empty(): boolean {
    return this.data.length === 0;
  }

  clear(): void {
    this.data.length = 0;
  }
}
