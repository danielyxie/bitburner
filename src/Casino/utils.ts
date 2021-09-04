import * as React from "react";

export function trusted(
  f: () => void,
): (event: React.MouseEvent<HTMLElement, MouseEvent>) => any {
  return function (event: React.MouseEvent<HTMLElement, MouseEvent>): any {
    if (!event.isTrusted) return;
    f();
  };
}
