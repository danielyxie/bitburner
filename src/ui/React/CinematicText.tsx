import React, { useState } from "react";

import { CinematicLine } from "./CinematicLine";

interface IProps {
  lines: string[];
  auto?: boolean;
  onDone?: () => void;
}

export function CinematicText(props: IProps): React.ReactElement {
  const [i, setI] = useState(0);
  const [done, setDone] = useState(false);

  function advance(): void {
    const newI = i + 1;
    setI(newI);
    if (newI >= props.lines.length) {
      if (props.onDone && props.auto) props.onDone();
      setDone(true);
    }
  }

  return (
    <div>
      {props.lines.slice(0, i).map((line, i) => (
        <pre key={i}>{line}</pre>
      ))}
      {props.lines.length > i && <CinematicLine key={i} text={props.lines[i]} onDone={advance} />}
      {!props.auto && props.onDone && done && (
        <button className="std-button" onClick={props.onDone}>
          Continue ...
        </button>
      )}
    </div>
  );
}
