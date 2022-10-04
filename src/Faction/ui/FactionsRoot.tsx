import { Explore, Info, LastPage, LocalPolice, NewReleases, Report, SportsMma } from "@mui/icons-material";
import { Box, Button, Container, Paper, Tooltip, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Player } from "../../Player";
import { Settings } from "../../Settings/Settings";
import { numeralWrapper } from "../../ui/numeralFormat";
import { Router } from "../../ui/GameRoot";
import { FactionNames } from "../data/FactionNames";
import { Faction } from "../Faction";
import { getFactionAugmentationsFiltered, joinFaction } from "../FactionHelpers";
import { Factions } from "../Factions";

export const InvitationsSeen: string[] = [];

const getAugsLeft = (faction: Faction): number => {
  const augs = getFactionAugmentationsFiltered(faction);

  return augs.filter((augmentation: string) => !Player.hasAugmentation(augmentation)).length;
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
  faction: Faction;

  joined: boolean;

  rerender: () => void;
}

const FactionElement = (props: IFactionProps): React.ReactElement => {
  const facInfo = props.faction.getInfo();

  function openFaction(faction: Faction): void {
    Router.toFaction(faction);
  }

  function openFactionAugPage(faction: Faction): void {
    Router.toFaction(faction, true);
  }

  function acceptInvitation(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, faction: string): void {
    if (!event.isTrusted) return;
    joinFaction(Factions[faction]);
    props.rerender();
  }

  return (
    <Paper
      sx={{
        display: "grid",
        p: 1,
        alignItems: "center",
        gridTemplateColumns: "minmax(0, 4fr)" + (props.joined ? " 1fr" : ""),
      }}
    >
      <Box display="flex" sx={{ alignItems: "center" }}>
        {props.joined ? (
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
        ) : (
          <Button sx={{ height: "48px", mr: 1 }} onClick={(e) => acceptInvitation(e, props.faction.name)}>
            Join!
          </Button>
        )}

        <span style={{ maxWidth: props.joined ? "70%" : "95%" }}>
          <Typography
            variant="h6"
            sx={{
              mr: 1,
              display: "grid",
              gridTemplateColumns: "fit-content(100vw) max-content",
              alignItems: "center",
            }}
          >
            <span
              style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}
              title={props.faction.name}
            >
              {props.faction.name}
            </span>

            <span style={{ display: "flex", alignItems: "center" }}>
              {Player.hasGangWith(props.faction.name) && (
                <Tooltip title="You have a gang with this Faction">
                  <SportsMma sx={{ color: Settings.theme.hp, ml: 1 }} />
                </Tooltip>
              )}

              {facInfo.special && (
                <Tooltip title="This is a special Faction">
                  <NewReleases sx={{ ml: 1, color: Settings.theme.money, transform: "rotate(180deg)" }} />
                </Tooltip>
              )}

              {!props.joined && facInfo.enemies.length > 0 && (
                <Tooltip
                  title={
                    <Typography>
                      This Faction is enemies with:
                      <ul>
                        {facInfo.enemies.map((enemy) => (
                          <li key={enemy}>{enemy}</li>
                        ))}
                      </ul>
                      Joining this Faction will prevent you from joining its enemies
                    </Typography>
                  }
                >
                  <Report sx={{ ml: 1, color: Settings.theme.error }} />
                </Tooltip>
              )}
            </span>
          </Typography>

          <span style={{ display: "flex", alignItems: "center" }}>
            {!Player.hasGangWith(props.faction.name) && <WorkTypesOffered faction={props.faction} />}

            {props.joined && (
              <Typography variant="body2" sx={{ display: "flex" }}>
                {getAugsLeft(props.faction)} Augmentations left
              </Typography>
            )}
          </span>
        </span>
      </Box>

      {props.joined && (
        <Box display="grid" sx={{ alignItems: "center", justifyItems: "left", gridAutoFlow: "row" }}>
          <Typography sx={{ color: Settings.theme.rep }}>
            {numeralWrapper.formatFavor(Math.floor(props.faction.favor))} favor
          </Typography>
          <Typography sx={{ color: Settings.theme.rep }}>
            {numeralWrapper.formatReputation(props.faction.playerReputation)} rep
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export function FactionsRoot(): React.ReactElement {
  const theme = useTheme();
  const setRerender = useState(false)[1];
  function rerender(): void {
    setRerender((old) => !old);
  }
  useEffect(() => {
    const id = setInterval(rerender, 200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    Player.factionInvitations.forEach((faction) => {
      if (InvitationsSeen.includes(faction)) return;
      InvitationsSeen.push(faction);
    });
  }, []);

  const allFactions = Object.values(FactionNames).map((faction) => faction as string);
  const allJoinedFactions = [...Player.factions];
  allJoinedFactions.sort((a, b) => allFactions.indexOf(a) - allFactions.indexOf(b));
  const invitations = Player.factionInvitations;

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

      <Box
        display="grid"
        sx={{
          gap: 1,
          gridTemplateColumns: (invitations.length > 0 ? "1fr " : "") + "2fr",
          [theme.breakpoints.down("lg")]: { gridTemplateColumns: "1fr", "& > span:nth-of-type(1)": { order: 1 } },
          gridTemplateRows: "minmax(0, 1fr)",
          "& > span > .MuiBox-root": {
            display: "grid",
            gridAutoRows: "70px",
            gap: 1,
          },
        }}
      >
        {invitations.length > 0 && (
          <span>
            <Typography variant="h5" color="primary">
              Faction Invitations
            </Typography>
            <Box>
              {invitations.map((facName) => {
                if (!Factions.hasOwnProperty(facName)) return null;
                return <FactionElement key={facName} faction={Factions[facName]} joined={false} rerender={rerender} />;
              })}
            </Box>
          </span>
        )}

        <span>
          <Typography variant="h5" color="primary">
            Your Factions
          </Typography>
          <Box>
            {allJoinedFactions.length > 0 ? (
              allJoinedFactions.map((facName) => {
                if (!Factions.hasOwnProperty(facName)) return null;
                return <FactionElement key={facName} faction={Factions[facName]} joined={true} rerender={rerender} />;
              })
            ) : (
              <Typography>You have not yet joined any Factions.</Typography>
            )}
          </Box>
        </span>
      </Box>
    </Container>
  );
}
