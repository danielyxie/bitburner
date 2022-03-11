import { Sleeve } from "../Sleeve";
import { numeralWrapper } from "../../../ui/numeralFormat";
import React from "react";
import Typography from "@mui/material/Typography";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";

import { Settings } from "../../../Settings/Settings";
import { formatNumber } from "../../../utils/StringHelperFunctions";
import { characterOverviewStyles as useStyles } from "../../../ui/React/CharacterOverview";

import { Money } from "../../../ui/React/Money";
import { MoneyRate } from "../../../ui/React/MoneyRate";
import { ReputationRate } from "../../../ui/React/ReputationRate";
import { SleeveTaskType } from "../SleeveTaskTypesEnum";
import { use } from "../../../ui/Context";

interface ITableRowData {
  content?: string;
  level?: number;
  exp?: number;
}

export const generateTableRow = (
  name: string,
  color: string,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  classes: any,
  data: ITableRowData
): React.ReactElement => {
  let content;

  if (data.content !== undefined) {
    content = data.content;
  } else if (data.level !== undefined && data.exp !== undefined) {
    content = `${formatNumber(data.level, 0)} (${numeralWrapper.formatExp(data.exp)} exp)`;
  } else if (data.level !== undefined && data.exp === undefined) {
    content = `${formatNumber(data.level, 0)}`;
  }

  return (
    <TableRow>
      <TableCell classes={{ root: classes.cellNone }}>
        <Typography style={{ color: color }}>{name}</Typography>
      </TableCell>
      <TableCell align="right" classes={{ root: classes.cellNone }}>
        <Typography style={{ color: color }}>
          {content}
        </Typography>
      </TableCell>
    </TableRow>
  )
}

interface IProps {
  sleeve: Sleeve;
}

export function StatsElement(props: IProps): React.ReactElement {
  const classes = useStyles();

  return (
    <Table sx={{ display: 'table', mb: 1, width: '100%' }}>
      <TableBody>
        {generateTableRow("City", Settings.theme.primary, classes, {
          content: props.sleeve.city
        })}
        {generateTableRow("HP", Settings.theme.hp, classes, {
          content: `${numeralWrapper.formatHp(props.sleeve.hp)} / ${numeralWrapper.formatHp(props.sleeve.max_hp)}`
        })}
        {generateTableRow("Hacking", Settings.theme.hack, classes, {
          level: props.sleeve.hacking,
          exp: props.sleeve.hacking_exp
        })}
        {generateTableRow("Strength", Settings.theme.combat, classes, {
          level: props.sleeve.strength,
          exp: props.sleeve.strength_exp
        })}
        {generateTableRow("Defense", Settings.theme.combat, classes, {
          level: props.sleeve.defense,
          exp: props.sleeve.defense_exp
        })}
        {generateTableRow("Dexterity", Settings.theme.combat, classes, {
          level: props.sleeve.dexterity,
          exp: props.sleeve.dexterity_exp
        })}
        {generateTableRow("Agility", Settings.theme.combat, classes, {
          level: props.sleeve.agility,
          exp: props.sleeve.agility_exp
        })}
        {generateTableRow("Charisma", Settings.theme.cha, classes, {
          level: props.sleeve.charisma,
          exp: props.sleeve.charisma_exp
        })}
        <TableRow>
          <TableCell classes={{ root: classes.cellNone }}>
            <br />
          </TableCell>
        </TableRow>
        {generateTableRow("Shock", Settings.theme.primary, classes, {
          content: numeralWrapper.formatSleeveShock(100 - props.sleeve.shock)
        })}
        {generateTableRow("Sync", Settings.theme.primary, classes, {
          content: numeralWrapper.formatSleeveSynchro(props.sleeve.sync)
        })}
        {generateTableRow("Memory", Settings.theme.primary, classes, {
          content: numeralWrapper.formatSleeveMemory(props.sleeve.memory)
        })}
      </TableBody>
    </Table>
  )
}

export function EarningsElement(props: IProps): React.ReactElement {
  const classes = useStyles();
  const player = use.Player();

  let data: any[][] = [];
  if (props.sleeve.currentTask === SleeveTaskType.Crime) {
    data = [
      [`Money`, <><Money money={parseFloat(props.sleeve.currentTaskLocation)} /> (on success)</>],
      [`Hacking Exp`, `${numeralWrapper.formatExp(props.sleeve.gainRatesForTask.hack)} (2x on success)`],
      [`Strength Exp`, `${numeralWrapper.formatExp(props.sleeve.gainRatesForTask.str)} (2x on success)`],
      [`Defense Exp`, `${numeralWrapper.formatExp(props.sleeve.gainRatesForTask.def)} (2x on success)`],
      [`Dexterity Exp`, `${numeralWrapper.formatExp(props.sleeve.gainRatesForTask.dex)} (2x on success)`],
      [`Agility Exp`, `${numeralWrapper.formatExp(props.sleeve.gainRatesForTask.agi)} (2x on success)`],
      [`Charisma Exp`, `${numeralWrapper.formatExp(props.sleeve.gainRatesForTask.cha)} (2x on success)`],
    ];
  } else {
    data = [
      [`Money:`, <MoneyRate money={5 * props.sleeve.gainRatesForTask.money} />],
      [`Hacking Exp:`, `${numeralWrapper.formatExp(5 * props.sleeve.gainRatesForTask.hack)} / sec`],
      [`Strength Exp:`, `${numeralWrapper.formatExp(5 * props.sleeve.gainRatesForTask.str)} / sec`],
      [`Defense Exp:`, `${numeralWrapper.formatExp(5 * props.sleeve.gainRatesForTask.def)} / sec`],
      [`Dexterity Exp:`, `${numeralWrapper.formatExp(5 * props.sleeve.gainRatesForTask.dex)} / sec`],
      [`Agility Exp:`, `${numeralWrapper.formatExp(5 * props.sleeve.gainRatesForTask.agi)} / sec`],
      [`Charisma Exp:`, `${numeralWrapper.formatExp(5 * props.sleeve.gainRatesForTask.cha)} / sec`],
    ];
    if (props.sleeve.currentTask === SleeveTaskType.Company || props.sleeve.currentTask === SleeveTaskType.Faction) {
      const repGain: number = props.sleeve.getRepGain(player);
      data.push([`Reputation:`, <ReputationRate reputation={5 * repGain} />]);
    }
  }

  return (
    <Table sx={{ display: 'table', mb: 1, width: '100%', lineHeight: 0 }}>
      <TableBody>
        <TableRow>
          <TableCell classes={{ root: classes.cellNone }}>
            <Typography variant='h6'>
              Earnings
            </Typography>
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
  )
}
