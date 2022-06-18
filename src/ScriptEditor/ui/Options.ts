export type WordWrapOptions = "on" | "off" | "bounded" | "wordWrapColumn";
export interface Options {
  theme: string;
  insertSpaces: boolean;
  fontSize: number;
  wordWrap: WordWrapOptions;
  vim: boolean;
}
