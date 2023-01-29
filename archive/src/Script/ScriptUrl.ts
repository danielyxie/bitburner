export class ScriptUrl {
  filename: string;
  url: string;
  moduleSequenceNumber: number;

  constructor(filename: string, url: string, moduleSequenceNumber: number) {
    this.filename = filename;
    this.url = url;
    this.moduleSequenceNumber = moduleSequenceNumber;
  }
}
