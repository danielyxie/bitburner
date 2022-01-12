import React, { useState, useEffect } from "react";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { IRouter } from "../../ui/Router";
import { Factions } from "../Factions";
import { Faction } from "../Faction";
import { joinFaction } from "../FactionHelpers";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import TableBody from "@mui/material/TableBody";
import { Table, TableCell } from "../../ui/React/Table";
import TableRow from "@mui/material/TableRow";

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
    props.router.toFaction(faction?.name);
  }

  function acceptInvitation(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, faction: string): void {
    if (!event.isTrusted) return;
    joinFaction(Factions[faction]);
    setRerender((x) => !x);
  }

  return (
    <>
      <Typography variant="h4">Factions</Typography>
      <Typography>Lists all factions you have joined</Typography>
      <br />
      <Box display="flex" flexDirection="column">
        {props.player.factions.map((faction: string) => (
          <Link key={faction} variant="h6" onClick={() => openFaction(Factions[faction])}>
            {faction}
          </Link>
        ))}
      </Box>
      <br />
      {props.player.factionInvitations.length > 0 && (
        <>
          <Typography variant="h5" color="primary">
            Outstanding Faction Invitations
          </Typography>
          <Typography>
            Lists factions you have been invited to. You can accept these faction invitations at any time.
          </Typography>
          <Table size="small" padding="none">
            <TableBody>
              {props.player.factionInvitations.map((faction: string) => (
                <TableRow key={faction}>
                  <TableCell>
                    <Typography noWrap>{faction}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Button onClick={(e) => acceptInvitation(e, faction)}>Join!</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </>
  );
}
