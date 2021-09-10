import React, { useState, useEffect } from "react";

import { IPlayer } from "../../IPlayer";

import { SleeveElem } from "../ui/SleeveElem";

interface IProps {
  player: IPlayer;
}

export function SleeveRoot(props: IProps): React.ReactElement {
  const setRerender = useState(false)[1];
  function rerender(): void {
    setRerender((old) => !old);
  }

  useEffect(() => {
    const id = setInterval(rerender, 150);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ width: "70%" }}>
      <h1>Sleeves</h1>
      <p>
        Duplicate Sleeves are MK-V Synthoids (synthetic androids) into which your consciousness has been copied. In
        other words, these Synthoids contain a perfect duplicate of your mind.
        <br />
        <br />
        Sleeves can be used to perform different tasks synchronously.
        <br />
        <br />
      </p>

      <button className="std-button" style={{ display: "inline-block" }}>
        FAQ
      </button>
      <a
        className="std-button"
        style={{ display: "inline-block" }}
        target="_blank"
        href="https://bitburner.readthedocs.io/en/latest/advancedgameplay/sleeves.html#duplicate-sleeves"
      >
        Documentation
      </a>
      <ul>
        {props.player.sleeves.map((sleeve, i) => (
          <li key={i}>
            <SleeveElem rerender={rerender} player={props.player} sleeve={sleeve} />
          </li>
        ))}
      </ul>
    </div>
  );
}
