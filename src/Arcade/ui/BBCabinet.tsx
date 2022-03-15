import React from "react";
import Typography from "@mui/material/Typography";

const metaBB = "https://bitburner-official.github.io/bitburner-legacy/";

const style = {
  width: "1060px",
  height: "800px",
  border: "0px",
} as any;

export function BBCabinetRoot(): React.ReactElement {
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
