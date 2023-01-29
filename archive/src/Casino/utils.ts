import * as React from "react";

export function trusted(f: () => void): (event: React.MouseEvent<HTMLElement, MouseEvent>) => void {
  return function (event: React.MouseEvent<HTMLElement, MouseEvent>): void {
    if (!event.isTrusted) return;
    f();
  };
}
