import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { Table, TableCell } from "../../ui/React/Table";
import { IRouter } from "../../ui/Router";
import { Faction } from "../Faction";
import { joinFaction } from "../FactionHelpers";
import { Factions } from "../Factions";

export const InvitationsSeen: string[] = [];

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

  function acceptInvitation(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, faction: string): void {
    if (!event.isTrusted) return;
    joinFaction(Factions[faction]);
    setRerender((x) => !x);
  }

  return (
    <Container disableGutters maxWidth="md" sx={{ mx: 0, mb: 10 }}>
      <Typography variant="h4">Factions</Typography>
      <Typography mb={4}>
        Throughout the game you may receive invitations from factions. There are many different factions, and each
        faction has different criteria for determining its potential members. Joining a faction and furthering its cause
        is crucial to progressing in the game and unlocking endgame content.
      </Typography>

      <Typography variant="h5" color="primary" mt={2} mb={1}>
        Factions you have joined:
      </Typography>
      {(props.player.factions.length > 0 && (
        <Paper sx={{ my: 1, p: 1, pb: 0, display: "inline-block" }}>
          <Table padding="none">
            <TableBody>
              {props.player.factions.map((faction: string) => (
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
                    <Typography noWrap ml={10} mb={1}>
                      Augmentations Left: {Factions[faction]
                        .augmentations
                        .filter((augmentation: string) =>
                          !props.player.hasAugmentation(augmentation))
                        .length}
                    </Typography>
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
