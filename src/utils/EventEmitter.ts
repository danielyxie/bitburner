/**
 * Generic Event Emitter class following a subscribe/publish paradigm.
 */
import { IMap } from "../types";

type cbFn = (...args: any[]) => any;

export interface ISubscriber {
  /**
   * Callback function that will be run when an event is emitted
   */
  cb: cbFn;

  /**
   * Name/identifier for this subscriber
   */
  id: string;
}

export class EventEmitter {
  /**
   * Map of Subscriber name -> Callback function
   */
  subscribers: IMap<cbFn> = {};

  constructor(subs?: ISubscriber[]) {
    if (Array.isArray(subs)) {
      for (const s of subs) {
        this.addSubscriber(s);
      }
    }
  }

  addSubscriber(s: ISubscriber): void {
    this.subscribers[s.id] = s.cb;
  }

  emitEvent(...args: any[]): void {
    for (const s in this.subscribers) {
      const sub = this.subscribers[s];

      sub(args);
    }
  }

  removeSubscriber(id: string): void {
    delete this.subscribers[id];
  }
}
