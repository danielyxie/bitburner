/**
 * React component for displaying the player's multipliers on the Augmentation UI page
 */
import * as React from "react";

import { Player } from "../../Player";
import { numeralWrapper } from "../../ui/numeralFormat";
import { Augmentations } from "../Augmentations";
import { Table, TableCell } from "../../ui/React/Table";
import TableBody from "@mui/material/TableBody";
import { Table as MuiTable } from "@mui/material";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

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

function Improvements({ r }: { r: number }): React.ReactElement {
  if (r) {
    console.log(r);
    return (
      <>
        <TableCell key="2">
          <Typography>&nbsp;{"=>"}&nbsp;</Typography>
        </TableCell>
        <TableCell key="3">
          <Typography>{numeralWrapper.formatPercentage(r)}</Typography>
        </TableCell>
      </>
    );
  }
  return <></>;
}

function MultiplierTable({ rows }: { rows: [string, number, number][] }): React.ReactElement {
  return (
    <Table size="small" padding="none">
      <TableBody>
        {rows.map((r: any) => (
          <TableRow key={r[0]}>
            <TableCell key="0">
              <Typography noWrap>{r[0]} multiplier:&nbsp;</Typography>
            </TableCell>
            <TableCell key="1" style={{ textAlign: "right" }}>
              <Typography noWrap>{numeralWrapper.formatPercentage(r[1])}</Typography>
            </TableCell>
            <Improvements r={r[2]} />
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
            ],
            [
              "Bladeburner Max Stamina",
              Player.bladeburner_max_stamina_mult,
              Player.bladeburner_max_stamina_mult * mults.bladeburner_max_stamina_mult,
            ],
            [
              "Bladeburner Stamina Gain",
              Player.bladeburner_stamina_gain_mult,
              Player.bladeburner_stamina_gain_mult * mults.bladeburner_stamina_gain_mult,
            ],
            [
              "Bladeburner Field Analysis",
              Player.bladeburner_analysis_mult,
              Player.bladeburner_analysis_mult * mults.bladeburner_analysis_mult,
            ],
          ]}
        />
        <br />
      </>
    );
  }

  return (
    <>
      <p>
        <strong>
          <u>Multipliers:</u>
        </strong>
      </p>
      <br />
      <MultiplierTable
        rows={[
          ["Hacking Chance ", Player.hacking_chance_mult, Player.hacking_chance_mult * mults.hacking_chance_mult],
          ["Hacking Speed ", Player.hacking_speed_mult, Player.hacking_speed_mult * mults.hacking_speed_mult],
          ["Hacking Money ", Player.hacking_money_mult, Player.hacking_money_mult * mults.hacking_money_mult],
          ["Hacking Growth ", Player.hacking_grow_mult, Player.hacking_grow_mult * mults.hacking_grow_mult],
        ]}
      />
      <br />

      <MultiplierTable
        rows={[
          ["Hacking Level ", Player.hacking_mult, Player.hacking_mult * mults.hacking_mult],
          ["Hacking Experience ", Player.hacking_exp_mult, Player.hacking_exp_mult * mults.hacking_exp_mult],
        ]}
      />
      <br />

      <MultiplierTable
        rows={[
          ["Strength Level ", Player.strength_mult, Player.strength_mult * mults.strength_mult],
          ["Strength Experience ", Player.strength_exp_mult, Player.strength_exp_mult * mults.strength_exp_mult],
        ]}
      />
      <br />

      <MultiplierTable
        rows={[
          ["Defense Level ", Player.defense_mult, Player.defense_mult * mults.defense_mult],
          ["Defense Experience ", Player.defense_exp_mult, Player.defense_exp_mult * mults.defense_exp_mult],
        ]}
      />
      <br />

      <MultiplierTable
        rows={[
          ["Dexterity Level ", Player.dexterity_mult, Player.dexterity_mult * mults.dexterity_mult],
          ["Dexterity Experience ", Player.dexterity_exp_mult, Player.dexterity_exp_mult * mults.dexterity_exp_mult],
        ]}
      />
      <br />

      <MultiplierTable
        rows={[
          ["Agility Level ", Player.agility_mult, Player.agility_mult * mults.agility_mult],
          ["Agility Experience ", Player.agility_exp_mult, Player.agility_exp_mult * mults.agility_exp_mult],
        ]}
      />
      <br />

      <MultiplierTable
        rows={[
          ["Charisma Level ", Player.charisma_mult, Player.charisma_mult * mults.charisma_mult],
          ["Charisma Experience ", Player.charisma_exp_mult, Player.charisma_exp_mult * mults.charisma_exp_mult],
        ]}
      />
      <br />

      <MultiplierTable
        rows={[
          [
            "Hacknet Node production ",
            Player.hacknet_node_money_mult,
            Player.hacknet_node_money_mult * mults.hacknet_node_money_mult,
          ],
          [
            "Hacknet Node purchase cost ",
            Player.hacknet_node_purchase_cost_mult,
            Player.hacknet_node_purchase_cost_mult * mults.hacknet_node_purchase_cost_mult,
          ],
          [
            "Hacknet Node RAM upgrade cost ",
            Player.hacknet_node_ram_cost_mult,
            Player.hacknet_node_ram_cost_mult * mults.hacknet_node_ram_cost_mult,
          ],
          [
            "Hacknet Node Core purchase cost ",
            Player.hacknet_node_core_cost_mult,
            Player.hacknet_node_core_cost_mult * mults.hacknet_node_core_cost_mult,
          ],
          [
            "Hacknet Node level upgrade cost ",
            Player.hacknet_node_level_cost_mult,
            Player.hacknet_node_level_cost_mult * mults.hacknet_node_level_cost_mult,
          ],
        ]}
      />
      <br />

      <MultiplierTable
        rows={[
          ["Company reputation gain ", Player.company_rep_mult, Player.company_rep_mult * mults.company_rep_mult],
          ["Faction reputation gain ", Player.faction_rep_mult, Player.faction_rep_mult * mults.faction_rep_mult],
          ["Salary ", Player.work_money_mult, Player.work_money_mult * mults.work_money_mult],
        ]}
      />
      <br />

      <MultiplierTable
        rows={[
          ["Crime success ", Player.crime_success_mult, Player.crime_success_mult * mults.crime_success_mult],
          ["Crime money ", Player.crime_money_mult, Player.crime_money_mult * mults.crime_money_mult],
        ]}
      />
      <br />

      <BladeburnerMults />
    </>
  );
}
