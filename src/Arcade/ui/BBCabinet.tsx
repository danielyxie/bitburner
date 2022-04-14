import Typography from "@mui/material/Typography";
import React, { useEffect } from "react";

import { Exploit } from "../../Exploits/Exploit";
import { use } from "../../ui/Context";

const metaBB = "https://bitburner-official.github.io/bitburner-legacy/";

const style = {
  width: "1060px",
  height: "800px",
  border: "0px",
} as any;

export function BBCabinetRoot(): React.ReactElement {
  const player = use.Player();
  useEffect(() => {
    window.addEventListener("message", function (this: Window, ev: MessageEvent<boolean>) {
      if (ev.isTrusted && ev.origin == "https://bitburner-official.github.io" && ev.data) {
        player.giveExploit(Exploit.TrueRecursion);
      }
    });
  });
  // prettier-ignore
  const joystick =
    <>
        <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>                                                                      </Typography>
        <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>                     ,'" "',                                  .-.     </Typography>
        <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>                    /       \                                (   )     </Typography>
        <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>                    |       |                            .-.  '-'  .-. </Typography>
        <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>                    \       /                           (   )     (   )</Typography>
        <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>                     '.___.'                             '-'  .-.  '-'</Typography>
        <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>                       |||                                   (   )  </Typography>
        <Typography sx={{lineHeight: '1em',whiteSpace: 'pre'}}>                       |||                                    '-'   </Typography>
    </>;
  return (
    <>
      <div
        style={{
          width: "1060px",
          height: "800px",
          padding: "0",
          overflow: "hidden",
          borderColor: "white",
          borderStyle: "solid",
          borderWidth: "5px",
        }}
      >
        <iframe src={metaBB} style={style} />
      </div>
      <div
        style={{
          width: "1060px",
          borderColor: "white",
          borderStyle: "solid",
          borderWidth: "5px",
        }}
      >
        {joystick}
      </div>
    </>
  );
}
