export function sanitizeFilename(filename: string): string {
  filename = filename.replace(/\/{2,}/g, '/');
  // filename = filename.replace(/^\//, '');
  filename = filename.replace(/\.ns$/, '.js');
  return filename;
}

const filenameRegex = /\/?[a-zA-Z0-9\-_]{1,}(\/[a-zA-Z0-9\-_]{1,})*\.(js|script|txt)/;

export function isValidFilename(filename: string): boolean {
  const match = filename.match(filenameRegex);
  return match !== null;
}

export function generateRecoveryFilename(): string {
  const buf = new Uint16Array(8);
  window.crypto.getRandomValues(buf);
  const u16hex = (val: number): string => { return val.toString(16).padStart(4, '0'); };
  // not actually a valid uuid but enough for this purpose
  const chunks: string[] = [
    u16hex(buf[0]),
    u16hex(buf[1]),
    '-',
    u16hex(buf[2]),
    '-',
    u16hex(buf[3]),
    '-',
    u16hex(buf[4]),
    '-',
    u16hex(buf[5]),
    u16hex(buf[6]),
    u16hex(buf[7])
  ];
  return `/_recovered/${chunks.join('')}`
}