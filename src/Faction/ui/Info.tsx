/**
 * React component for general information about the faction. This includes the
 * factions "motto", reputation, favor, and gameplay instructions
 */
import React, { useState, useEffect } from "react";

import { Faction } from "../../Faction/Faction";
import { FactionInfo } from "../../Faction/FactionInfo";

import { Reputation } from "../../ui/React/Reputation";
import { Favor } from "../../ui/React/Favor";
import { MathComponent } from "mathjax-react";

import makeStyles from "@mui/styles/makeStyles";
import createStyles from "@mui/styles/createStyles";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";

type IProps = {
  faction: Faction;
  factionInfo: FactionInfo;
};

const useStyles = makeStyles(() =>
  createStyles({
    noformat: {
      whiteSpace: "pre-wrap",
      lineHeight: "1em",
    },
  }),
);

export function Info(props: IProps): React.ReactElement {
  const setRerender = useState(false)[1];
  function rerender(): void {
    setRerender((old) => !old);
  }

  useEffect(() => {
    const id = setInterval(rerender, 1000);
    return () => clearInterval(id);
  }, []);

  const classes = useStyles();

  const favorGain = props.faction.getFavorGain()[0];
  return (
    <>
      <Typography classes={{ root: classes.noformat }}>{props.factionInfo.infoText}</Typography>
      <Typography>-------------------------</Typography>
      <Box display="flex">
        <Tooltip
          title={
            <>
              <Typography>
                You will have {Favor(props.faction.favor + favorGain)} faction favor after installing an Augmentation.
              </Typography>
              <MathComponent tex={String.raw`\large{r = \text{total faction reputation}}`} />
              <MathComponent
                tex={String.raw`\large{favor=\left\lfloor\log_{1.02}\left(\frac{r+25000}{25500}\right)\right\rfloor}`}
              />
            </>
          }
        >
          <Typography>Reputation: {Reputation(props.faction.playerReputation)}</Typography>
        </Tooltip>
      </Box>

      <Typography>-------------------------</Typography>

      <Box display="flex">
        <Tooltip
          title={
            <>
              <Typography>
                Faction favor increases the rate at which you earn reputation for this faction by 1% per favor. Faction
                favor is gained whenever you install an Augmentation. The amount of favor you gain depends on the total
                amount of reputation you earned with this faction. Across all resets.
              </Typography>
              <MathComponent tex={String.raw`\large{r = reputation}`} />
              <MathComponent tex={String.raw`\large{\Delta r = \Delta r \times \frac{100+favor}{100}}`} />
            </>
          }
        >
          <Typography>Faction Favor: {Favor(props.faction.favor)}</Typography>
        </Tooltip>
      </Box>

      <Typography>-------------------------</Typography>
      <Typography>
        Perform work/carry out assignments for your faction to help further its cause! By doing so you will earn
        reputation for your faction. You will also gain reputation passively over time, although at a very slow rate.
        Earning reputation will allow you to purchase Augmentations through this faction, which are powerful upgrades
        that enhance your abilities.
      </Typography>
    </>
  );
}
