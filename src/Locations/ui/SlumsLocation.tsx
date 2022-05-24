/**
 * React Subcomponent for displaying a location's UI, when that location is a slum
 *
 * This subcomponent renders all of the buttons for committing crimes
 */
import * as React from "react";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";

import { Crimes } from "../../Crime/Crimes";
import { Crime } from "../../Crime/Crime";

import { CrimeWork } from "../../PersonObjects/Work/CrimeWork";

import { numeralWrapper } from "../../ui/numeralFormat";
import { use } from "../../ui/Context";
import { Box } from "@mui/material";

export function SlumsLocation(): React.ReactElement {
  const player = use.Player();
  const router = use.Router();
  const handleCrime = (c: Crime) => (e: React.MouseEvent<HTMLElement>) => {
    if (!e.isTrusted) {
      return;
    }
    player.startWork(new CrimeWork(c));
    router.toWork();
  };

  interface ICrimeButtonProps {
    crime: Crime;
    tooltip: string;
  }

  const CrimeButton = (props: ICrimeButtonProps): React.ReactElement => (
    <Tooltip title={<>{props.tooltip}</>}>
      <Button onClick={handleCrime(props.crime)}>
        {props.crime.name} ({numeralWrapper.formatPercentage(props.crime.successRate(player))} chance of success)
      </Button>
    </Tooltip>
  );

  return (
    <Box sx={{ display: "grid", width: "fit-content" }}>
      <CrimeButton tooltip={"Attempt to shoplift from a low-end retailer"} crime={Crimes.Shoplift} />
      <CrimeButton tooltip={"Attempt to commit armed robbery on a high-end store"} crime={Crimes.RobStore} />
      <CrimeButton tooltip={"Attempt to mug a random person on the street"} crime={Crimes.Mug} />
      <CrimeButton tooltip={"Attempt to rob property from someone's house"} crime={Crimes.Larceny} />
      <CrimeButton tooltip={"Attempt to deal drugs"} crime={Crimes.DealDrugs} />
      <CrimeButton tooltip={"Attempt to forge corporate bonds"} crime={Crimes.BondForgery} />
      <CrimeButton tooltip={"Attempt to smuggle illegal arms into the city"} crime={Crimes.TraffickArms} />
      <CrimeButton tooltip={"Attempt to murder a random person on the street"} crime={Crimes.Homicide} />
      <CrimeButton tooltip={"Attempt to commit grand theft auto"} crime={Crimes.GrandTheftAuto} />
      <CrimeButton tooltip={"Attempt to kidnap and ransom a high-profile-target"} crime={Crimes.Kidnap} />
      <CrimeButton tooltip={"Attempt to assassinate a high-profile target"} crime={Crimes.Assassination} />
      <CrimeButton tooltip={"Attempt to pull off the ultimate heist"} crime={Crimes.Heist} />
    </Box>
  );
}
