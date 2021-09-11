import React from "react";
import { Stats } from "./Stats";
import { Console } from "./Console";
import { AllPages } from "./AllPages";

import { IPlayer } from "../../PersonObjects/IPlayer";
import { IEngine } from "../../IEngine";
import { IBladeburner } from "../IBladeburner";

interface IProps {
  bladeburner: IBladeburner;
  engine: IEngine;
  player: IPlayer;
}

export function Root(props: IProps): React.ReactElement {
  return (
    <div className="bladeburner-container">
      <div style={{ height: "60%", display: "block", position: "relative" }}>
        <div
          style={{
            height: "100%",
            width: "30%",
            display: "inline-block",
            border: "1px solid white",
          }}
        >
          <Stats bladeburner={props.bladeburner} player={props.player} engine={props.engine} />
        </div>
        <Console bladeburner={props.bladeburner} player={props.player} />
      </div>
      <div
        style={{
          width: "70%",
          display: "block",
          border: "1px solid white",
          marginTop: "6px",
          padding: "6px",
          position: "relative",
        }}
      >
        <AllPages bladeburner={props.bladeburner} player={props.player} />
      </div>
    </div>
  );
}
