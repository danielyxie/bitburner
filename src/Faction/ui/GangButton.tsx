import { Button, Typography, Box, Paper, Tooltip } from "@mui/material";
import React, { useState } from "react";
import { GangConstants } from "../../Gang/data/Constants";
import { use } from "../../ui/Context";
import { Faction } from "../Faction";
import { CreateGangModal } from "./CreateGangModal";

type IProps = {
  faction: Faction;
};

export function GangButton({ faction }: IProps): React.ReactElement {
  const player = use.Player();
  const router = use.Router();
  const [gangOpen, setGangOpen] = useState(false);

  if (
    !GangConstants.Names.includes(faction.name) || // not even a gang
    !player.isAwareOfGang() || // doesn't know about gang
    (player.inGang() && player.getGangName() !== faction.name) // already in another gang
  ) {
    return <></>;
  }

  let data = {
    enabled: false,
    title: "",
    tooltip: "" as string | React.ReactElement,
    description: "",
  };

  if (player.inGang()) {
    data = {
      enabled: true,
      title: "Manage Gang",
      tooltip: "",
      description: "Manage a gang for this Faction. Gangs will earn you money and faction reputation",
    };
  } else {
    data = {
      enabled: player.canAccessGang(),
      title: "Create Gang",
      tooltip: !player.canAccessGang() ? (
        <Typography>Unlocked when reaching {GangConstants.GangKarmaRequirement} karma</Typography>
      ) : (
        ""
      ),
      description: "Create a gang for this Faction. Gangs will earn you money and faction reputation",
    };
  }

  const manageGang = (): void => {
    // If player already has a gang, just go to the gang UI
    if (player.inGang()) {
      return router.toGang();
    }

    setGangOpen(true);
  };

  return (
    <>
      <Box>
        <Paper sx={{ my: 1, p: 1 }}>
          <Tooltip title={data.tooltip}>
            <span>
              <Button onClick={manageGang} disabled={!data.enabled}>
                {data.title}
              </Button>
            </span>
          </Tooltip>
          <Typography>{data.description}</Typography>
        </Paper>
      </Box>

      <CreateGangModal facName={faction.name} open={gangOpen} onClose={() => setGangOpen(false)} />
    </>
  );
}
