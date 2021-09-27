import React from "react";
import { GeneralActionPage } from "./GeneralActionPage";
import { ContractPage } from "./ContractPage";
import { OperationPage } from "./OperationPage";
import { BlackOpPage } from "./BlackOpPage";
import { SkillPage } from "./SkillPage";
import { IBladeburner } from "../IBladeburner";
import { IPlayer } from "../../PersonObjects/IPlayer";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

interface IProps {
  bladeburner: IBladeburner;
  player: IPlayer;
}

export function AllPages(props: IProps): React.ReactElement {
  const [value, setValue] = React.useState(0);

  function handleChange(event: React.SyntheticEvent, tab: number): void {
    setValue(tab);
  }

  return (
    <>
      <Tabs variant="fullWidth" value={value} onChange={handleChange} aria-label="basic tabs example">
        <Tab label="General" />
        <Tab label="Contracts" />
        <Tab label="Operations" />
        <Tab label="BlackOps" />
        <Tab label="Skills" />
      </Tabs>
      <Box sx={{ p: 1 }}>
        {value === 0 && <GeneralActionPage bladeburner={props.bladeburner} player={props.player} />}
        {value === 1 && <ContractPage bladeburner={props.bladeburner} player={props.player} />}
        {value === 2 && <OperationPage bladeburner={props.bladeburner} player={props.player} />}
        {value === 3 && <BlackOpPage bladeburner={props.bladeburner} player={props.player} />}
        {value === 4 && <SkillPage bladeburner={props.bladeburner} />}
      </Box>
    </>
  );
}
