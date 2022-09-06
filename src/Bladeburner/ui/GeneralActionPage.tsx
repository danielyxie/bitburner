import * as React from "react";
import { GeneralActionList } from "./GeneralActionList";
import { IBladeburner } from "../IBladeburner";
import Typography from "@mui/material/Typography";

interface IProps {
  bladeburner: IBladeburner;
}

export function GeneralActionPage(props: IProps): React.ReactElement {
  return (
    <>
      <Typography>These are generic actions that will assist you in your Bladeburner duties.</Typography>
      <GeneralActionList bladeburner={props.bladeburner} />
    </>
  );
}
