import * as React from "react";

export function Augmentation({ name }: { name: string }): JSX.Element {
  return (
    <span className={"samefont"} style={{ color: "white" }}>
      {name}
    </span>
  );
}
