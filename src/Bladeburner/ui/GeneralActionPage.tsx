import * as React from "react";
import { GeneralActionList } from "./GeneralActionList";
import { Bladeburner } from "../Bladeburner";
import Typography from "@mui/material/Typography";

interface IProps {
  bladeburner: Bladeburner;
}

export function GeneralActionPage(props: IProps): React.ReactElement {
  return (
    <>
      <Typography>These are generic actions that will assist you in your Bladeburner duties.</Typography>
      <GeneralActionList bladeburner={props.bladeburner} />
    </>
  );
}
