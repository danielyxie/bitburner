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
import { isSleeveClassWork } from "../Work/SleeveClassWork";
import { isSleeveFactionWork } from "../Work/SleeveFactionWork";
import { isSleeveCompanyWork } from "../Work/SleeveCompanyWork";
import { isSleeveCrimeWork } from "../Work/SleeveCrimeWork";
import { BitNodeMultipliers } from "../../../BitNode/BitNodeMultipliers";

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
  if (isSleeveCrimeWork(props.sleeve.currentWork)) {
    const gains = props.sleeve.currentWork.getExp();
    data = [
      [`Money:`, <Money money={5 * gains.money * BitNodeMultipliers.CrimeMoney} />],
      [`Hacking Exp:`, `${numeralWrapper.formatExp(5 * gains.hackExp * BitNodeMultipliers.CrimeExpGain)}`],
      [`Strength Exp:`, `${numeralWrapper.formatExp(5 * gains.strExp * BitNodeMultipliers.CrimeExpGain)}`],
      [`Defense Exp:`, `${numeralWrapper.formatExp(5 * gains.defExp * BitNodeMultipliers.CrimeExpGain)}`],
      [`Dexterity Exp:`, `${numeralWrapper.formatExp(5 * gains.dexExp * BitNodeMultipliers.CrimeExpGain)}`],
      [`Agility Exp:`, `${numeralWrapper.formatExp(5 * gains.agiExp * BitNodeMultipliers.CrimeExpGain)}`],
      [`Charisma Exp:`, `${numeralWrapper.formatExp(5 * gains.chaExp * BitNodeMultipliers.CrimeExpGain)}`],
    ];
  }
  if (isSleeveClassWork(props.sleeve.currentWork)) {
    const rates = props.sleeve.currentWork.calculateRates(player, props.sleeve);
    data = [
      [`Money:`, <MoneyRate money={5 * rates.money} />],
      [`Hacking Exp:`, `${numeralWrapper.formatExp(5 * rates.hackExp * BitNodeMultipliers.ClassGymExpGain)} / sec`],
      [`Strength Exp:`, `${numeralWrapper.formatExp(5 * rates.strExp * BitNodeMultipliers.ClassGymExpGain)} / sec`],
      [`Defense Exp:`, `${numeralWrapper.formatExp(5 * rates.defExp * BitNodeMultipliers.ClassGymExpGain)} / sec`],
      [`Dexterity Exp:`, `${numeralWrapper.formatExp(5 * rates.dexExp * BitNodeMultipliers.ClassGymExpGain)} / sec`],
      [`Agility Exp:`, `${numeralWrapper.formatExp(5 * rates.agiExp * BitNodeMultipliers.ClassGymExpGain)} / sec`],
      [`Charisma Exp:`, `${numeralWrapper.formatExp(5 * rates.chaExp * BitNodeMultipliers.ClassGymExpGain)} / sec`],
    ];
  }
  if (isSleeveFactionWork(props.sleeve.currentWork)) {
    const rates = props.sleeve.currentWork.getExpRates(props.sleeve);
    const repGain = props.sleeve.currentWork.getReputationRate(props.sleeve);
    data = [
      [`Hacking Exp:`, `${numeralWrapper.formatExp(5 * rates.hackExp * BitNodeMultipliers.FactionWorkExpGain)} / sec`],
      [`Strength Exp:`, `${numeralWrapper.formatExp(5 * rates.strExp * BitNodeMultipliers.FactionWorkExpGain)} / sec`],
      [`Defense Exp:`, `${numeralWrapper.formatExp(5 * rates.defExp * BitNodeMultipliers.FactionWorkExpGain)} / sec`],
      [`Dexterity Exp:`, `${numeralWrapper.formatExp(5 * rates.dexExp * BitNodeMultipliers.FactionWorkExpGain)} / sec`],
      [`Agility Exp:`, `${numeralWrapper.formatExp(5 * rates.agiExp * BitNodeMultipliers.FactionWorkExpGain)} / sec`],
      [`Charisma Exp:`, `${numeralWrapper.formatExp(5 * rates.chaExp * BitNodeMultipliers.FactionWorkExpGain)} / sec`],
      [`Reputation:`, <ReputationRate reputation={5 * repGain * BitNodeMultipliers.FactionWorkRepGain} />],
    ];
  }

  if (isSleeveCompanyWork(props.sleeve.currentWork)) {
    const rates = props.sleeve.currentWork.getGainRates(player, props.sleeve);
    data = [
      [`Money:`, <MoneyRate money={5 * rates.money * BitNodeMultipliers.CompanyWorkMoney} />],
      [`Hacking Exp:`, `${numeralWrapper.formatExp(5 * rates.hackExp * BitNodeMultipliers.CompanyWorkExpGain)} / sec`],
      [`Strength Exp:`, `${numeralWrapper.formatExp(5 * rates.strExp * BitNodeMultipliers.CompanyWorkExpGain)} / sec`],
      [`Defense Exp:`, `${numeralWrapper.formatExp(5 * rates.defExp * BitNodeMultipliers.CompanyWorkExpGain)} / sec`],
      [`Dexterity Exp:`, `${numeralWrapper.formatExp(5 * rates.dexExp * BitNodeMultipliers.CompanyWorkExpGain)} / sec`],
      [`Agility Exp:`, `${numeralWrapper.formatExp(5 * rates.agiExp * BitNodeMultipliers.CompanyWorkExpGain)} / sec`],
      [`Charisma Exp:`, `${numeralWrapper.formatExp(5 * rates.chaExp * BitNodeMultipliers.CompanyWorkExpGain)} / sec`],
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
