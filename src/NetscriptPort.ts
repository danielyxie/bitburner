import { Settings } from "./Settings/Settings";

export interface IPort {
	/** Write data to the port, making room if the port is full.
	* @param value - The data to be written
	* @returns The element that was displaced if the port was full, otherwise null
	*/
	write(value: string | number) : string | number;
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
export class NetscriptPort implements IPort
{
	#data:any[];
	constructor()
	{
		this.#data = [];
	}
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	write(value: string | number): string | number 
	{
      this.#data.push(value);
      if (this.#data.length > Settings.MaxPortCapacity) {
        return this.#data.shift();
      }
      return null;
    }
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	tryWrite(value: string | number): boolean {
      if (this.#data.length >= Settings.MaxPortCapacity) {
        return false;
      }
      this.#data.push(value);
      return true;
    }
    read(): string | number {
      if (this.#data.length === 0) {
        return "NULL PORT DATA";
      }
      return this.#data.shift();
    }
    peek(): string | number {
      if (this.#data.length === 0) {
        return "NULL PORT DATA";
      } else {
        return this.#data[0];
      }
    }
    full(): boolean {
      return this.#data.length == Settings.MaxPortCapacity;
    }

    empty(): boolean {
      return this.#data.length === 0;
    }

    clear(): void {
      this.#data.length = 0;
    }
}
