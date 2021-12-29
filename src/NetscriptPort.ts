import { Settings } from "./Settings/Settings";

export interface IPort {
    /** Write data to the port, making room if the port is full.
    * @param value - The data to be written
    * @returns The element that was displaced if the port was full, otherwise null
    */
    write(value: string | number) : string | number | null;
    /** Write data to the port, failing if the port is full.
    * @param value - The data to be written
    * @returns True if the data was written, false otherwise
    */
    tryWrite(value: string | number) : boolean;
    /** Read the data at the front of the port, removing it from the port
    */
    read(): string | number;
    /** Peek at the data at the front of the port, leaving it on the port
    */
    peek(): string | number;
    /** True if the port is at capacity
    */
    full(): boolean;
    /** True if the port has no data */
    empty(): boolean;
    /** Remove all data from the port */
    clear(): void;
}
export class NetscriptPort implements IPort {
    #data:any[];
    constructor() {
        this.#data = [];
    }
    write(value: string | number): string | number | null {
        let result = null;
        let runawayProtection = 0;
        while(!this.tryWrite(value) && runawayProtection++ < 100) {
            result = this.read();
        }
        return result;
    }
    tryWrite(value: string | number): boolean {
        if (typeof value !== "string" && typeof value !== "number") {
            throw `Invalid data type ${typeof value}, expected string or number`;
        }
        if (this.full()) {
            return false;
        }
        this.#data.push(value);
        return true;
    }
    read(): string | number {
      const result = this.peek();//ensures consistency
      this.#data.shift();
      return result;
    }
    peek(): string | number {
      if (this.empty()) {
        return "NULL PORT DATA";
      } else {
        return this.#data[0];
      }
    }
    full(): boolean {
      return this.#data.length >= Settings.MaxPortCapacity;
    }

    empty(): boolean {
      return this.#data.length === 0;
    }

    clear(): void {
      this.#data.length = 0;
    }
}
