
const blobCache: { [hash: string]: string } = {};

export class BlobCache {
  static get(hash: string) {
    return blobCache[hash];
  }

  static store(hash: string, value: string): void {
    if (blobCache[hash]) return;
    blobCache[hash] = value;
  }

  static removeByValue(value: string) {
    const keys = Object.keys(blobCache).filter((key) => blobCache[key] === value);
    keys.forEach((key) => delete blobCache[key]);
  }
}
