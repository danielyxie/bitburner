import React, { useState } from "react";

import { CinematicLine } from "./CinematicLine";

interface IProps {
  lines: string[];
  onDone?: () => void;
}

export function CinematicText(props: IProps): React.ReactElement {
  const [i, setI] = useState(0);

  function advance(): void {
    const newI = i + 1;
    setI(newI);
    if (newI >= props.lines.length && props.onDone) props.onDone();
  }

  return (
    <>
      {props.lines.slice(0, i).map((line, i) => (
        <pre key={i}>{line}</pre>
      ))}
      {props.lines.length > i && <CinematicLine key={i} text={props.lines[i]} onDone={advance} />}
    </>
  );
}
