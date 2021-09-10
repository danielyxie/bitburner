import React, { useState, useEffect } from "react";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { Programs } from "../Programs";

interface IProps {
  player: IPlayer;
}

export function ProgramsRoot(props: IProps): React.ReactElement {
  const setRerender = useState(false)[1];
  function rerender(): void {
    setRerender((old) => !old);
  }
  const [divisionName, setDivisionName] = useState("Overview");

  useEffect(() => {
    const id = setInterval(rerender, 20);
    return () => clearInterval(id);
  }, []);

  return (
    <div id="create-program-container">
      <p id="create-program-page-text">
        This page displays any programs that you are able to create. Writing the code for a program takes time, which
        can vary based on how complex the program is. If you are working on creating a program you can cancel at any
        time. Your progress will be saved and you can continue later.
      </p>

      <ul id="create-program-list">
        {Object.keys(Programs).map((programName) => {
          const program = Programs[programName];
          if (program == null) return <></>;
          const create = program.create;
          if (create === null) return <></>;
          return (
            <a
              key={programName}
              className="a-link-button tooltip"
              onClick={() => props.player.startCreateProgramWork(program.name, create.time, create.level)}
            >
              {program.name}
              <span className="tooltiptext">{create.tooltip}</span>
            </a>
          );
        })}
      </ul>
    </div>
  );
}
