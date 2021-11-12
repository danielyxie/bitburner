function getDB(): Promise<IDBObjectStore> {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject("Indexed DB does not exists");
    }
    /**
     * DB is called bitburnerSave
     * Object store is called savestring
     * key for the Object store is called save
     * Version `1` is important
     */
    const indexedDbRequest: IDBOpenDBRequest = window.indexedDB.open("bitburnerSave", 1);

    // This is called when there's no db to begin with. It's important, don't remove it.
    indexedDbRequest.onupgradeneeded = function (this: IDBRequest<IDBDatabase>) {
      const db = this.result;
      db.createObjectStore("savestring");
    };

    indexedDbRequest.onerror = function (this: IDBRequest<IDBDatabase>, ev: Event) {
      reject(`Failed to get IDB ${ev}`);
    };

    indexedDbRequest.onsuccess = function (this: IDBRequest<IDBDatabase>) {
      const db = this.result;
      if (!db) {
        reject("database loadign result was undefined");
        return;
      }
      resolve(db.transaction(["savestring"], "readwrite").objectStore("savestring"));
    };
  });
}

export function load(): Promise<string> {
  return new Promise((resolve, reject) => {
    getDB()
      .then((db) => {
        return new Promise<string>((resolve, reject) => {
          const request: IDBRequest<string> = db.get("save");
          request.onerror = function (this: IDBRequest<string>, ev: Event) {
            reject("Error in Database request to get savestring: " + ev);
          };

          request.onsuccess = function (this: IDBRequest<string>) {
            resolve(this.result);
          };
        }).then((saveString) => resolve(saveString));
      })
      .catch((r) => reject(r));
  });
}

export function save(saveString: string): Promise<void> {
  return getDB().then((db) => {
    return new Promise<void>((resolve, reject) => {
      // We'll save to both localstorage and indexedDb
      const request = db.put(saveString, "save");

      request.onerror = function (e) {
        reject("Error saving game to IndexedDB: " + e);
      };

      request.onsuccess = () => resolve();
    });
  });
}

export function deleteGame(): Promise<void> {
  return getDB().then((db) => {
    db.delete("save");
  });
}
