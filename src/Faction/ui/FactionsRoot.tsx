import { Explore, Info, LastPage, LocalPolice } from "@mui/icons-material";
import { Box, Button, Container, Paper, TableBody, TableRow, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { Settings } from "../../Settings/Settings";
import { numeralWrapper } from "../../ui/numeralFormat";
import { Table, TableCell } from "../../ui/React/Table";
import { IRouter } from "../../ui/Router";
import { FactionNames } from "../data/FactionNames";
import { Faction } from "../Faction";
import { getFactionAugmentationsFiltered, joinFaction } from "../FactionHelpers";
import { Factions } from "../Factions";

export const InvitationsSeen: string[] = [];

const getAugsLeft = (faction: Faction, player: IPlayer): number => {
  const augs = getFactionAugmentationsFiltered(player, faction);

  return augs.filter((augmentation: string) => !player.hasAugmentation(augmentation)).length;
};

interface IWorkTypeProps {
  faction: Faction;
}

const fontSize = "small";
const marginRight = 0.5;

const WorkTypesOffered = (props: IWorkTypeProps): React.ReactElement => {
  const info = props.faction.getInfo();

  return (
    <>
      {info.offerFieldWork && (
        <Tooltip title="This Faction offers field work">
          <Explore sx={{ color: Settings.theme.info, mr: marginRight }} fontSize={fontSize} />
        </Tooltip>
      )}
      {info.offerHackingWork && (
        <Tooltip title="This Faction offers hacking work">
          <LastPage sx={{ color: Settings.theme.hack, mr: marginRight }} fontSize={fontSize} />
        </Tooltip>
      )}
      {info.offerSecurityWork && (
        <Tooltip title="This Faction offers security work">
          <LocalPolice sx={{ color: Settings.theme.combat, mr: marginRight }} fontSize={fontSize} />
        </Tooltip>
      )}
    </>
  );
};

interface IFactionProps {
  player: IPlayer;
  router: IRouter;
  faction: Faction;

  joined: boolean;
}

const FactionElement = (props: IFactionProps): React.ReactElement => {
  function openFaction(faction: Faction): void {
    props.router.toFaction(faction);
  }

  function openFactionAugPage(faction: Faction): void {
    props.router.toFaction(faction, true);
  }

  return (
    <Paper sx={{ display: "grid", p: 1, alignItems: "center", gridTemplateColumns: "minmax(0, 4fr) 1fr" }}>
      <Box display="flex" sx={{ alignItems: "center" }}>
        <Box
          display="grid"
          sx={{
            mr: 1,
            gridTemplateColumns: "1fr 1fr",
            minWidth: "fit-content",
            gap: 0.5,
            "& .MuiButton-root": { height: "48px" },
          }}
        >
          <Button onClick={() => openFaction(props.faction)}>Details</Button>
          <Button onClick={() => openFactionAugPage(props.faction)}>Augments</Button>
        </Box>

        <span style={{ maxWidth: "65%" }}>
          <Typography
            variant="h6"
            sx={{
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
              mr: 1,
            }}
          >
            {props.faction.name}
          </Typography>

          <span style={{ display: "flex", alignItems: "center" }}>
            <WorkTypesOffered faction={props.faction} />
            <Typography variant="body2" sx={{ display: "flex" }}>
              {getAugsLeft(props.faction, props.player)} Augmentations left
            </Typography>
          </span>
        </span>
      </Box>

      <Box display="grid" sx={{ alignItems: "center", justifyItems: "left", gridAutoFlow: "row" }}>
        <Typography sx={{ color: Settings.theme.rep }}>
          {numeralWrapper.formatFavor(props.faction.favor)} favor
        </Typography>
        <Typography sx={{ color: Settings.theme.rep }}>
          {numeralWrapper.formatReputation(props.faction.playerReputation)} rep
        </Typography>
      </Box>
    </Paper>
  );
};

interface IProps {
  player: IPlayer;
  router: IRouter;
}

export function FactionsRoot(props: IProps): React.ReactElement {
  const setRerender = useState(false)[1];
  function rerender(): void {
    setRerender((old) => !old);
  }
  useEffect(() => {
    const id = setInterval(rerender, 200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    props.player.factionInvitations.forEach((faction) => {
      if (InvitationsSeen.includes(faction)) return;
      InvitationsSeen.push(faction);
    });
  }, []);

  function openFaction(faction: Faction): void {
    props.router.toFaction(faction);
  }

  function openFactionAugPage(faction: Faction): void {
    props.router.toFaction(faction, true);
  }

  function acceptInvitation(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, faction: string): void {
    if (!event.isTrusted) return;
    joinFaction(Factions[faction]);
    setRerender((x) => !x);
  }

  const allFactions = Object.values(FactionNames).map((faction) => faction as string);
  const allJoinedFactions = [...props.player.factions];
  allJoinedFactions.sort((a, b) => allFactions.indexOf(a) - allFactions.indexOf(b));

  return (
    <Container disableGutters maxWidth="lg" sx={{ mx: 0, mb: 10 }}>
      <Typography variant="h4">
        Factions
        <Tooltip
          title={
            <Typography>
              Throughout the game you may receive invitations from factions. There are many different factions, and each
              faction has different criteria for determining its potential members. Joining a faction and furthering its
              cause is crucial to progressing in the game and unlocking endgame content.
            </Typography>
          }
        >
          <Info sx={{ ml: 1, mb: 0 }} color="info" />
        </Tooltip>
      </Typography>

      <Typography variant="h5" color="primary">
        Your Factions
      </Typography>
      <Box display="grid" sx={{ gap: 1 }}>
        {allJoinedFactions.map((facName) => {
          if (!Factions.hasOwnProperty(facName)) return null;
          return (
            <FactionElement
              key={facName}
              faction={Factions[facName]}
              player={props.player}
              router={props.router}
              joined={true}
            />
          );
        })}
      </Box>
      {(allJoinedFactions.length > 0 && (
        <Paper sx={{ my: 1, p: 1, pb: 0, display: "inline-block" }}>
          <Table padding="none" style={{ width: "fit-content" }}>
            <TableBody>
              {allJoinedFactions.map((faction: string) => (
                <TableRow key={faction}>
                  <TableCell>
                    <Typography noWrap mb={1}>
                      {faction}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Box ml={1} mb={1}>
                      <Button onClick={() => openFaction(Factions[faction])}>Details</Button>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Box ml={1} mb={1}>
                      <Button sx={{ width: "100%" }} onClick={() => openFactionAugPage(Factions[faction])}>
                        Augmentations Left: {getAugsLeft(Factions[faction], props.player)}
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )) || <Typography>You haven't joined any factions.</Typography>}
      <Typography variant="h5" color="primary" mt={4} mb={1}>
        Outstanding Faction Invitations
      </Typography>
      <Typography mb={1}>
        Factions you have been invited to. You can accept these faction invitations at any time:
      </Typography>
      {(props.player.factionInvitations.length > 0 && (
        <Paper sx={{ my: 1, mb: 4, p: 1, pb: 0, display: "inline-block" }}>
          <Table padding="none">
            <TableBody>
              {props.player.factionInvitations.map((faction: string) => (
                <TableRow key={faction}>
                  <TableCell>
                    <Typography noWrap mb={1}>
                      {faction}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Box ml={1} mb={1}>
                      <Button onClick={(e) => acceptInvitation(e, faction)}>Join!</Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )) || <Typography>You have no outstanding faction invites.</Typography>}
    </Container>
  );
}
