import React from "react";

export interface IStyleSettings {
  fontFamily: React.CSSProperties["fontFamily"];
  lineHeight: React.CSSProperties["lineHeight"];
}

export const defaultStyles: IStyleSettings = {
  lineHeight: 1.5,
  fontFamily: "Lucida Console, Lucida Sans Unicode, Fira Mono, Consolas, Courier New, Courier, monospace, Times New Roman"
}
