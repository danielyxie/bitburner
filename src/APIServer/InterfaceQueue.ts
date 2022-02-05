import logger from './SocketLogs';
interface QueueItem<T> {
    key:string,
    timestamp: number,
    params: [string, string, T]
}

export default class InterfaceQueue<PayloadParams> {
  _data:QueueItem<PayloadParams>[];
  _meta:{updated:number|null} = {updated:null};
  _keys:{[index:string]: boolean} = {};
  _storageKey:string;


  constructor(queueCacheKey:string) {
    this._storageKey = queueCacheKey;
    //Load data from localstorage
    let parsedData;
    try {
        let cachedData = localStorage.getItem(this._storageKey) || '{}';
        parsedData = JSON.parse(cachedData);
        // Bootstrap if needed
        if (parsedData.data) {
            logger.log(`[InterfaceQueue] Existing Queue detected and loaded.`);
        } else {
            logger.log('[InterfaceQueue] Queue file not found, building new queue.');   
        }
    } catch (e) {
        // Do nothing

    }
    this._data = parsedData.data || [];
    this._meta = parsedData.meta || { updated: Date.now() };

    // Regenerate key map
    this._data.forEach((item) => {
        this._keys[item.key] = true;
    });

    window.addEventListener("beforeunload", () => this._saveCache);
  }
  get lastUpdated() {
    return this._meta.updated;
  }
  _saveCache = () => {
    logger.log('[InterfaceQueue] Saving queue...');
    this._meta.updated = Date.now();
    localStorage.setItem(this._storageKey, JSON.stringify({
      meta: this._meta,
      data: this._data,
    }));
    logger.log('[InterfaceQueue] Cache Saved!');
  };
  push = (type:string, action:string, payload:PayloadParams, key:string, queueTime:number = -1) => {
    // If given a key they event should be unique
    if (key && this._keys[key]) {
      this._data = this._data.filter((item) => item.key !== key);
    }
    // Push a new event to the queue
    this._data.push({
      key,
      timestamp: queueTime,
      params: [type, action, payload],
    });
  };
  flush = (handler:Function) => {
    // Copy and reset the queue, this is to avoid an infinte pattern if items are added to queue as they are flushed
    const flushQueue = [...this._data];
    this._data = [];
    this._keys = {};
    let item;

    while (item = flushQueue.shift()) {
      if (item) {
        handler(...item.params, item.key, item.timestamp);
      }
    }
  };
}
