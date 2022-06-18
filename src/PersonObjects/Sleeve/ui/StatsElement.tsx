import React from "react";

import { Typography, Table, TableBody, TableCell, TableRow } from "@mui/material";

import { numeralWrapper } from "../../../ui/numeralFormat";
import { Settings } from "../../../Settings/Settings";
import { StatsRow } from "../../../ui/React/StatsRow";
import { characterOverviewStyles as useStyles } from "../../../ui/React/CharacterOverview";
import { Money } from "../../../ui/React/Money";
import { MoneyRate } from "../../../ui/React/MoneyRate";
import { ReputationRate } from "../../../ui/React/ReputationRate";
import { use } from "../../../ui/Context";

import { Sleeve } from "../Sleeve";
import { SleeveTaskType } from "../SleeveTaskTypesEnum";

interface IProps {
  sleeve: Sleeve;
}

export function StatsElement(props: IProps): React.ReactElement {
  const classes = useStyles();

  return (
    <Table sx={{ display: "table", mb: 1, width: "100%" }}>
      <TableBody>
        <StatsRow name="City" color={Settings.theme.primary} data={{ content: props.sleeve.city }} />
        <StatsRow
          name="HP"
          color={Settings.theme.hp}
          data={{
            content: `${numeralWrapper.formatHp(props.sleeve.hp)} / ${numeralWrapper.formatHp(props.sleeve.max_hp)}`,
          }}
        />
        <StatsRow
          name="Hacking"
          color={Settings.theme.hack}
          data={{ level: props.sleeve.hacking, exp: props.sleeve.hacking_exp }}
        />
        <StatsRow
          name="Strength"
          color={Settings.theme.combat}
          data={{ level: props.sleeve.strength, exp: props.sleeve.strength_exp }}
        />
        <StatsRow
          name="Defense"
          color={Settings.theme.combat}
          data={{ level: props.sleeve.defense, exp: props.sleeve.defense_exp }}
        />
        <StatsRow
          name="Dexterity"
          color={Settings.theme.combat}
          data={{ level: props.sleeve.dexterity, exp: props.sleeve.dexterity_exp }}
        />
        <StatsRow
          name="Agility"
          color={Settings.theme.combat}
          data={{ level: props.sleeve.agility, exp: props.sleeve.agility_exp }}
        />
        <StatsRow
          name="Charisma"
          color={Settings.theme.cha}
          data={{ level: props.sleeve.charisma, exp: props.sleeve.charisma_exp }}
        />
        <TableRow>
          <TableCell classes={{ root: classes.cellNone }}>
            <br />
          </TableCell>
        </TableRow>
        <StatsRow
          name="Shock"
          color={Settings.theme.primary}
          data={{ content: numeralWrapper.formatSleeveShock(100 - props.sleeve.shock) }}
        />
        <StatsRow
          name="Sync"
          color={Settings.theme.primary}
          data={{ content: numeralWrapper.formatSleeveSynchro(props.sleeve.sync) }}
        />
        <StatsRow
          name="Memory"
          color={Settings.theme.primary}
          data={{ content: numeralWrapper.formatSleeveMemory(props.sleeve.memory) }}
        />
      </TableBody>
    </Table>
  );
}

export function EarningsElement(props: IProps): React.ReactElement {
  const classes = useStyles();
  const player = use.Player();

  let data: any[][] = [];
  if (props.sleeve.currentTask === SleeveTaskType.Crime) {
    data = [
      [
        `Money`,
        <>
          <Money money={parseFloat(props.sleeve.currentTaskLocation)} /> (on success)
        </>,
      ],
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
    <Table sx={{ display: "table", mb: 1, width: "100%", lineHeight: 0 }}>
      <TableBody>
        <TableRow>
          <TableCell classes={{ root: classes.cellNone }}>
            <Typography variant="h6">Earnings</Typography>
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
  );
}
