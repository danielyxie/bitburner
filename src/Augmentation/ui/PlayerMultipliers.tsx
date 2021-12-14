/**
 * React component for displaying the player's multipliers on the Augmentation UI page
 */
import * as React from "react";

import { Player } from "../../Player";
import { numeralWrapper } from "../../ui/numeralFormat";
import { Augmentations } from "../Augmentations";
import { Table, TableCell } from "../../ui/React/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { BitNodeMultipliers } from "../../BitNode/BitNodeMultipliers";

function calculateAugmentedStats(): any {
  const augP: any = {};
  for (const aug of Player.queuedAugmentations) {
    const augObj = Augmentations[aug.name];
    for (const mult in augObj.mults) {
      const v = augP[mult] ? augP[mult] : 1;
      augP[mult] = v * augObj.mults[mult];
    }
  }
  return augP;
}

function Improvements({ r, m }: { r: number; m: number }): React.ReactElement {
  if (r) {
    return (
      <>
        <TableCell key="2">
          <Typography>&nbsp;{"=>"}&nbsp;</Typography>
        </TableCell>
        <TableCell key="3">
          <Typography>
            {numeralWrapper.formatPercentage(r)} <BN5Stat base={r} mult={m} />
          </Typography>
        </TableCell>
      </>
    );
  }
  return <></>;
}

interface IBN5StatsProps {
  base: number;
  mult: number;
}

function BN5Stat(props: IBN5StatsProps): React.ReactElement {
  if (props.mult === 1) return <></>;
  return <>({numeralWrapper.formatPercentage(props.base * props.mult)})</>;
}

function MultiplierTable({ rows }: { rows: [string, number, number, number][] }): React.ReactElement {
  return (
    <Table size="small" padding="none">
      <TableBody>
        {rows.map((r: any) => (
          <TableRow key={r[0]}>
            <TableCell key="0">
              <Typography noWrap>{r[0]} multiplier:&nbsp;</Typography>
            </TableCell>
            <TableCell key="1" style={{ textAlign: "right" }}>
              <Typography noWrap>
                {numeralWrapper.formatPercentage(r[1])} <BN5Stat base={r[1]} mult={r[3]} />
              </Typography>
            </TableCell>
            <Improvements r={r[2]} m={r[3]} />
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function PlayerMultipliers(): React.ReactElement {
  const mults = calculateAugmentedStats();

  function BladeburnerMults(): React.ReactElement {
    if (!Player.canAccessBladeburner()) return <></>;
    return (
      <>
        <MultiplierTable
          rows={[
            [
              "Bladeburner Success Chance",
              Player.bladeburner_success_chance_mult,
              Player.bladeburner_success_chance_mult * mults.bladeburner_success_chance_mult,
              1,
            ],
            [
              "Bladeburner Max Stamina",
              Player.bladeburner_max_stamina_mult,
              Player.bladeburner_max_stamina_mult * mults.bladeburner_max_stamina_mult,
              1,
            ],
            [
              "Bladeburner Stamina Gain",
              Player.bladeburner_stamina_gain_mult,
              Player.bladeburner_stamina_gain_mult * mults.bladeburner_stamina_gain_mult,
              1,
            ],
            [
              "Bladeburner Field Analysis",
              Player.bladeburner_analysis_mult,
              Player.bladeburner_analysis_mult * mults.bladeburner_analysis_mult,
              1,
            ],
          ]}
        />
        <br />
      </>
    );
  }

  return (
    <>
      <Typography variant="h4">Multipliers</Typography>
      <Box mx={2}>
        <MultiplierTable
          rows={[
            ["Hacking Chance ", Player.hacking_chance_mult, Player.hacking_chance_mult * mults.hacking_chance_mult, 1],
            ["Hacking Speed ", Player.hacking_speed_mult, Player.hacking_speed_mult * mults.hacking_speed_mult, 1],
            ["Hacking Money ", Player.hacking_money_mult, Player.hacking_money_mult * mults.hacking_money_mult, 1],
            ["Hacking Growth ", Player.hacking_grow_mult, Player.hacking_grow_mult * mults.hacking_grow_mult, 1],
          ]}
        />
        <br />

        <MultiplierTable
          rows={[
            [
              "Hacking Level ",
              Player.hacking_mult,
              Player.hacking_mult * mults.hacking_mult,
              BitNodeMultipliers.HackingLevelMultiplier,
            ],
            [
              "Hacking Experience ",
              Player.hacking_exp_mult,
              Player.hacking_exp_mult * mults.hacking_exp_mult,
              BitNodeMultipliers.HackExpGain,
            ],
          ]}
        />
        <br />

        <MultiplierTable
          rows={[
            [
              "Strength Level ",
              Player.strength_mult,
              Player.strength_mult * mults.strength_mult,
              BitNodeMultipliers.StrengthLevelMultiplier,
            ],
            ["Strength Experience ", Player.strength_exp_mult, Player.strength_exp_mult * mults.strength_exp_mult, 1],
          ]}
        />
        <br />

        <MultiplierTable
          rows={[
            [
              "Defense Level ",
              Player.defense_mult,
              Player.defense_mult * mults.defense_mult,
              BitNodeMultipliers.DefenseLevelMultiplier,
            ],
            ["Defense Experience ", Player.defense_exp_mult, Player.defense_exp_mult * mults.defense_exp_mult, 1],
          ]}
        />
        <br />

        <MultiplierTable
          rows={[
            [
              "Dexterity Level ",
              Player.dexterity_mult,
              Player.dexterity_mult * mults.dexterity_mult,
              BitNodeMultipliers.DexterityLevelMultiplier,
            ],
            [
              "Dexterity Experience ",
              Player.dexterity_exp_mult,
              Player.dexterity_exp_mult * mults.dexterity_exp_mult,
              1,
            ],
          ]}
        />
        <br />

        <MultiplierTable
          rows={[
            [
              "Agility Level ",
              Player.agility_mult,
              Player.agility_mult * mults.agility_mult,
              BitNodeMultipliers.AgilityLevelMultiplier,
            ],
            ["Agility Experience ", Player.agility_exp_mult, Player.agility_exp_mult * mults.agility_exp_mult, 1],
          ]}
        />
        <br />

        <MultiplierTable
          rows={[
            [
              "Charisma Level ",
              Player.charisma_mult,
              Player.charisma_mult * mults.charisma_mult,
              BitNodeMultipliers.CharismaLevelMultiplier,
            ],
            ["Charisma Experience ", Player.charisma_exp_mult, Player.charisma_exp_mult * mults.charisma_exp_mult, 1],
          ]}
        />
        <br />

        <MultiplierTable
          rows={[
            [
              "Hacknet Node production ",
              Player.hacknet_node_money_mult,
              Player.hacknet_node_money_mult * mults.hacknet_node_money_mult,
              BitNodeMultipliers.HacknetNodeMoney,
            ],
            [
              "Hacknet Node purchase cost ",
              Player.hacknet_node_purchase_cost_mult,
              Player.hacknet_node_purchase_cost_mult * mults.hacknet_node_purchase_cost_mult,
              1,
            ],
            [
              "Hacknet Node RAM upgrade cost ",
              Player.hacknet_node_ram_cost_mult,
              Player.hacknet_node_ram_cost_mult * mults.hacknet_node_ram_cost_mult,
              1,
            ],
            [
              "Hacknet Node Core purchase cost ",
              Player.hacknet_node_core_cost_mult,
              Player.hacknet_node_core_cost_mult * mults.hacknet_node_core_cost_mult,
              1,
            ],
            [
              "Hacknet Node level upgrade cost ",
              Player.hacknet_node_level_cost_mult,
              Player.hacknet_node_level_cost_mult * mults.hacknet_node_level_cost_mult,
              1,
            ],
          ]}
        />
        <br />

        <MultiplierTable
          rows={[
            ["Company reputation gain ", Player.company_rep_mult, Player.company_rep_mult * mults.company_rep_mult, 1],
            [
              "Faction reputation gain ",
              Player.faction_rep_mult,
              Player.faction_rep_mult * mults.faction_rep_mult,
              BitNodeMultipliers.FactionWorkRepGain,
            ],
            [
              "Salary ",
              Player.work_money_mult,
              Player.work_money_mult * mults.work_money_mult,
              BitNodeMultipliers.CompanyWorkMoney,
            ],
          ]}
        />
        <br />

        <MultiplierTable
          rows={[
            ["Crime success ", Player.crime_success_mult, Player.crime_success_mult * mults.crime_success_mult, 1],
            [
              "Crime money ",
              Player.crime_money_mult,
              Player.crime_money_mult * mults.crime_money_mult,
              BitNodeMultipliers.CrimeMoney,
            ],
          ]}
        />
        <br />

        <BladeburnerMults />
      </Box>
    </>
  );
}
