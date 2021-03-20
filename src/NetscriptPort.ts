import { Settings } from "./Settings/Settings";

export class NetscriptPort {
    data: any[] = [];

    constructor() {}

    write(data: any): any {
        this.data.push(data);
        if (this.data.length > Settings.MaxPortCapacity) {
            return this.data.shift();
        }
        return null;
    }

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
            var foo = this.data.slice();
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
