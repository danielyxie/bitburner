import React, { useState, useEffect } from "react";
import { convertTimeMsToTimeElapsedString } from "../../utils/StringHelperFunctions";
import { CONSTANTS } from "../../Constants";
import { StaneksGiftEvents } from "../StaneksGiftEvents";
import { MainBoard } from "./MainBoard";
import { IStaneksGift } from "../IStaneksGift";
import Typography from "@mui/material/Typography";

type IProps = {
  staneksGift: IStaneksGift;
};

export function StaneksGiftRoot({ staneksGift }: IProps): React.ReactElement {
  const setRerender = useState(true)[1];
  function rerender(): void {
    setRerender((o) => !o);
  }
  useEffect(() => StaneksGiftEvents.subscribe(rerender), []);
  return (
    <>
      <Typography variant="h4">Stanek's Gift</Typography>
      <Typography>
        The gift is a grid on which you can place upgrades called fragments. The main type of fragment increases a stat,
        like your hacking skill or agility exp. Once a stat fragment is placed it then needs to be charged via scripts
        in order to become useful. The other kind of fragment is called booster fragments. They increase the efficiency
        of the charged happening on fragments neighboring them (no diagonal). Q/E to rotate fragments.
      </Typography>
      {staneksGift.storedCycles > 5 && (
        <Typography>
          Bonus time: {convertTimeMsToTimeElapsedString(CONSTANTS._idleSpeed * staneksGift.storedCycles)}
        </Typography>
      )}
      <MainBoard gift={staneksGift} />
    </>
  );
}
