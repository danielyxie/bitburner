/**
 * React Component for the first part of a gang member details.
 * Contains skills and exp.
 */
import React from "react";
import { useGang } from "./Context";

import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";

import { numeralWrapper } from "../../ui/numeralFormat";
import { GangMember } from "../GangMember";
import { Settings } from "../../Settings/Settings";
import { MoneyRate } from "../../ui/React/MoneyRate";
import { StatsRow } from "../../ui/React/StatsRow";
import { characterOverviewStyles as useStyles } from "../../ui/React/CharacterOverview";

interface IProps {
  member: GangMember;
}

export function GangMemberStats(props: IProps): React.ReactElement {
  const classes = useStyles();

  const asc = {
    hack: props.member.calculateAscensionMult(props.member.hack_asc_points),
    str: props.member.calculateAscensionMult(props.member.str_asc_points),
    def: props.member.calculateAscensionMult(props.member.def_asc_points),
    dex: props.member.calculateAscensionMult(props.member.dex_asc_points),
    agi: props.member.calculateAscensionMult(props.member.agi_asc_points),
    cha: props.member.calculateAscensionMult(props.member.cha_asc_points),
  };



  const gang = useGang();
  const data = [
    [`Current Task:`, `${props.member.task}`],
    [`Money:`, <MoneyRate money={5 * props.member.calculateMoneyGain(gang)} />],
    [`Respect:`, `${numeralWrapper.formatRespect(5 * props.member.calculateRespectGain(gang))} / sec`],
    [`Wanted Level:`, `${numeralWrapper.formatWanted(5 * props.member.calculateWantedLevelGain(gang))} / sec`],
    [`Total Respect:`, `${numeralWrapper.formatRespect(props.member.earnedRespect)}`],
  ];

  return (
    <>
      <Tooltip
        title={
          <Typography>
            Hk: x{numeralWrapper.formatMultiplier(props.member.hack_mult * asc.hack)}(x
            {numeralWrapper.formatMultiplier(props.member.hack_mult)} Eq, x{numeralWrapper.formatMultiplier(asc.hack)}{" "}
            Asc)
            <br />
            St: x{numeralWrapper.formatMultiplier(props.member.str_mult * asc.str)}
            (x{numeralWrapper.formatMultiplier(props.member.str_mult)} Eq, x{numeralWrapper.formatMultiplier(asc.str)}{" "}
            Asc)
            <br />
            Df: x{numeralWrapper.formatMultiplier(props.member.def_mult * asc.def)}
            (x{numeralWrapper.formatMultiplier(props.member.def_mult)} Eq, x{numeralWrapper.formatMultiplier(asc.def)}{" "}
            Asc)
            <br />
            Dx: x{numeralWrapper.formatMultiplier(props.member.dex_mult * asc.dex)}
            (x{numeralWrapper.formatMultiplier(props.member.dex_mult)} Eq, x{numeralWrapper.formatMultiplier(asc.dex)}{" "}
            Asc)
            <br />
            Ag: x{numeralWrapper.formatMultiplier(props.member.agi_mult * asc.agi)}
            (x{numeralWrapper.formatMultiplier(props.member.agi_mult)} Eq, x{numeralWrapper.formatMultiplier(asc.agi)}{" "}
            Asc)
            <br />
            Ch: x{numeralWrapper.formatMultiplier(props.member.cha_mult * asc.cha)}
            (x{numeralWrapper.formatMultiplier(props.member.cha_mult)} Eq, x{numeralWrapper.formatMultiplier(asc.cha)}{" "}
            Asc)
          </Typography>
        }
      >
        <Table sx={{ display: 'table', mb: 1, width: '100%' }}>
          <TableBody>
            <StatsRow name="Hacking" color={Settings.theme.hack} data={{ level: props.member.hack, exp: props.member.hack_exp }} />
            <StatsRow name="Strength" color={Settings.theme.combat} data={{ level: props.member.str, exp: props.member.str_exp }} />
            <StatsRow name="Defense" color={Settings.theme.combat} data={{ level: props.member.def, exp: props.member.def_exp }} />
            <StatsRow name="Dexterity" color={Settings.theme.combat} data={{ level: props.member.dex, exp: props.member.dex_exp }} />
            <StatsRow name="Agility" color={Settings.theme.combat} data={{ level: props.member.agi, exp: props.member.agi_exp }} />
            <StatsRow name="Charisma" color={Settings.theme.cha} data={{ level: props.member.cha, exp: props.member.cha_exp }} />
            <TableRow>
              <TableCell classes={{ root: classes.cellNone }}>
                <br />
              </TableCell>
            </TableRow>
            {data.map(([a, b]) => (
              <TableRow key={a.toString() + b.toString()}>
                <TableCell classes={{ root: classes.cellNone }}>
                  <Typography>{a}</Typography>
                </TableCell>
                <TableCell align="right" classes={{ root: classes.cellNone }}>
                  <Typography>{b}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Tooltip>
    </>
  );
}
