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
import { isSleeveClassWork } from "../Work/SleeveClassWork";
import { isSleeveFactionWork } from "../Work/SleeveFactionWork";
import { isSleeveCompanyWork } from "../Work/SleeveCompanyWork";

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
            content: `${numeralWrapper.formatHp(props.sleeve.hp.current)} / ${numeralWrapper.formatHp(
              props.sleeve.hp.max,
            )}`,
          }}
        />
        <StatsRow
          name="Hacking"
          color={Settings.theme.hack}
          data={{ level: props.sleeve.skills.hacking, exp: props.sleeve.exp.hacking }}
        />
        <StatsRow
          name="Strength"
          color={Settings.theme.combat}
          data={{ level: props.sleeve.skills.strength, exp: props.sleeve.exp.strength }}
        />
        <StatsRow
          name="Defense"
          color={Settings.theme.combat}
          data={{ level: props.sleeve.skills.defense, exp: props.sleeve.exp.defense }}
        />
        <StatsRow
          name="Dexterity"
          color={Settings.theme.combat}
          data={{ level: props.sleeve.skills.dexterity, exp: props.sleeve.exp.dexterity }}
        />
        <StatsRow
          name="Agility"
          color={Settings.theme.combat}
          data={{ level: props.sleeve.skills.agility, exp: props.sleeve.exp.agility }}
        />
        <StatsRow
          name="Charisma"
          color={Settings.theme.cha}
          data={{ level: props.sleeve.skills.charisma, exp: props.sleeve.exp.charisma }}
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

  let data: (string | JSX.Element)[][] = [];
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
  if (isSleeveClassWork(props.sleeve.currentWork)) {
    const rates = props.sleeve.currentWork.calculateRates(player, props.sleeve);
    data = [
      [`Money:`, <MoneyRate money={5 * rates.money} />],
      [`Hacking Exp:`, `${numeralWrapper.formatExp(5 * rates.hackExp)} / sec`],
      [`Strength Exp:`, `${numeralWrapper.formatExp(5 * rates.strExp)} / sec`],
      [`Defense Exp:`, `${numeralWrapper.formatExp(5 * rates.defExp)} / sec`],
      [`Dexterity Exp:`, `${numeralWrapper.formatExp(5 * rates.dexExp)} / sec`],
      [`Agility Exp:`, `${numeralWrapper.formatExp(5 * rates.agiExp)} / sec`],
      [`Charisma Exp:`, `${numeralWrapper.formatExp(5 * rates.chaExp)} / sec`],
    ];
  }
  if (isSleeveFactionWork(props.sleeve.currentWork)) {
    const rates = props.sleeve.currentWork.getExpRates(props.sleeve);
    const repGain = props.sleeve.currentWork.getReputationRate(props.sleeve);
    data = [
      [`Hacking Exp:`, `${numeralWrapper.formatExp(5 * rates.hackExp)} / sec`],
      [`Strength Exp:`, `${numeralWrapper.formatExp(5 * rates.strExp)} / sec`],
      [`Defense Exp:`, `${numeralWrapper.formatExp(5 * rates.defExp)} / sec`],
      [`Dexterity Exp:`, `${numeralWrapper.formatExp(5 * rates.dexExp)} / sec`],
      [`Agility Exp:`, `${numeralWrapper.formatExp(5 * rates.agiExp)} / sec`],
      [`Charisma Exp:`, `${numeralWrapper.formatExp(5 * rates.chaExp)} / sec`],
      [`Reputation:`, <ReputationRate reputation={5 * repGain} />],
    ];
  }

  if (isSleeveCompanyWork(props.sleeve.currentWork)) {
    const rates = props.sleeve.currentWork.getGainRates(player, props.sleeve);
    data = [
      [`Money:`, <MoneyRate money={5 * rates.money} />],
      [`Hacking Exp:`, `${numeralWrapper.formatExp(5 * rates.hackExp)} / sec`],
      [`Strength Exp:`, `${numeralWrapper.formatExp(5 * rates.strExp)} / sec`],
      [`Defense Exp:`, `${numeralWrapper.formatExp(5 * rates.defExp)} / sec`],
      [`Dexterity Exp:`, `${numeralWrapper.formatExp(5 * rates.dexExp)} / sec`],
      [`Agility Exp:`, `${numeralWrapper.formatExp(5 * rates.agiExp)} / sec`],
      [`Charisma Exp:`, `${numeralWrapper.formatExp(5 * rates.chaExp)} / sec`],
      [`Reputation:`, <ReputationRate reputation={5 * rates.reputation} />],
    ];
  }

  return (
    <Table sx={{ display: "table", mb: 1, width: "100%", lineHeight: 0 }}>
      <TableBody>
        <TableRow>
          <TableCell classes={{ root: classes.cellNone }}>
            <Typography variant="h6">Earnings {props.sleeve.storedCycles > 50 ? "(overclock)" : ""}</Typography>
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
