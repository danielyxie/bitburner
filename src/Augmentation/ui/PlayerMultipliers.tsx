/**
 * React component for displaying the player's multipliers on the Augmentation UI page
 */
import { DoubleArrow } from "@mui/icons-material";
import { List, ListItem, ListItemText, Paper, Typography } from "@mui/material";
import * as React from "react";
import { BitNodeMultipliers } from "../../BitNode/BitNodeMultipliers";
import { Player } from "../../Player";
import { Settings } from "../../Settings/Settings";
import { numeralWrapper } from "../../ui/numeralFormat";
import { StaticAugmentations } from "../StaticAugmentations";

interface IAugmentedStats {
  [index: string]: number;
}

function calculateAugmentedStats(): IAugmentedStats {
  const augP: IAugmentedStats = {};
  for (const aug of Player.queuedAugmentations) {
    const augObj = StaticAugmentations[aug.name];
    for (const mult of Object.keys(augObj.mults)) {
      const v = augP[mult] ? augP[mult] : 1;
      augP[mult] = v * augObj.mults[mult];
    }
  }
  return augP;
}

interface IBitNodeModifiedStatsProps {
  base: number;
  mult: number;
  color: string;
}

function BitNodeModifiedStats(props: IBitNodeModifiedStatsProps): React.ReactElement {
  // If player doesn't have SF5 or if the property isn't affected by BitNode mults
  if (props.mult === 1 || Player.sourceFileLvl(5) === 0)
    return <Typography color={props.color}>{numeralWrapper.formatPercentage(props.base)}</Typography>;

  return (
    <Typography color={props.color}>
      <span style={{ opacity: 0.5 }}>{numeralWrapper.formatPercentage(props.base)}</span>{" "}
      {numeralWrapper.formatPercentage(props.base * props.mult)}
    </Typography>
  );
}

interface MultiplierListItemData {
  mult: string;
  current: number;
  augmented: number;
  bnMult?: number;
  color?: string;
}

interface IMultiplierListProps {
  rows: MultiplierListItemData[];
}

function MultiplierList(props: IMultiplierListProps): React.ReactElement {
  const listItems = props.rows
    .map((data) => {
      const { mult, current, augmented, bnMult = 1, color = Settings.theme.primary } = data;

      if (!isNaN(augmented)) {
        return (
          <ListItem key={mult} disableGutters sx={{ py: 0 }}>
            <ListItemText
              sx={{ my: 0.1 }}
              primary={
                <Typography color={color}>
                  <b>{mult}</b>
                </Typography>
              }
              secondary={
                <span style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                  <BitNodeModifiedStats base={current} mult={bnMult} color={color} />
                  <DoubleArrow fontSize="small" color="success" sx={{ mb: 0.5, mx: 1 }} />
                  <BitNodeModifiedStats base={augmented} mult={bnMult} color={Settings.theme.success} />
                </span>
              }
              disableTypography
            />
          </ListItem>
        );
      }
      return;
    })
    .filter((i) => i !== undefined);

  return listItems.length > 0 ? <List disablePadding>{listItems}</List> : <></>;
}

export function PlayerMultipliers(): React.ReactElement {
  const mults = calculateAugmentedStats();

  const leftColData: MultiplierListItemData[] = [
    ...[
      {
        mult: "Hacking Chance",
        current: Player.hacking_chance_mult,
        augmented: Player.hacking_chance_mult * mults.hacking_chance_mult,
      },
      {
        mult: "Hacking Speed",
        current: Player.hacking_speed_mult,
        augmented: Player.hacking_speed_mult * mults.hacking_speed_mult,
      },
      {
        mult: "Hacking Money",
        current: Player.hacking_money_mult,
        augmented: Player.hacking_money_mult * mults.hacking_money_mult,
      },
      {
        mult: "Hacking Growth",
        current: Player.hacking_grow_mult,
        augmented: Player.hacking_grow_mult * mults.hacking_grow_mult,
      },
      {
        mult: "Hacking Level",
        current: Player.hacking_mult,
        augmented: Player.hacking_mult * mults.hacking_mult,
        bnMult: BitNodeMultipliers.HackingLevelMultiplier,
      },
      {
        mult: "Hacking Experience",
        current: Player.hacking_exp_mult,
        augmented: Player.hacking_exp_mult * mults.hacking_exp_mult,
        bnMult: BitNodeMultipliers.HackExpGain,
      },
    ].map((data: MultiplierListItemData) =>
      Object.defineProperty(data, "color", {
        value: Settings.theme.hack,
      }),
    ),
    ...[
      {
        mult: "Strength Level",
        current: Player.strength_mult,
        augmented: Player.strength_mult * mults.strength_mult,
        bnMult: BitNodeMultipliers.StrengthLevelMultiplier,
      },
      {
        mult: "Strength Experience",
        current: Player.strength_exp_mult,
        augmented: Player.strength_exp_mult * mults.strength_exp_mult,
      },
      {
        mult: "Defense Level",
        current: Player.defense_mult,
        augmented: Player.defense_mult * mults.defense_mult,
        bnMult: BitNodeMultipliers.DefenseLevelMultiplier,
      },
      {
        mult: "Defense Experience",
        current: Player.defense_exp_mult,
        augmented: Player.defense_exp_mult * mults.defense_exp_mult,
      },
      {
        mult: "Dexterity Level",
        current: Player.dexterity_mult,
        augmented: Player.dexterity_mult * mults.dexterity_mult,
        bnMult: BitNodeMultipliers.DexterityLevelMultiplier,
      },
      {
        mult: "Dexterity Experience",
        current: Player.dexterity_exp_mult,
        augmented: Player.dexterity_exp_mult * mults.dexterity_exp_mult,
      },
      {
        mult: "Agility Level",
        current: Player.agility_mult,
        augmented: Player.agility_mult * mults.agility_mult,
        bnMult: BitNodeMultipliers.AgilityLevelMultiplier,
      },
      {
        mult: "Agility Experience",
        current: Player.agility_exp_mult,
        augmented: Player.agility_exp_mult * mults.agility_exp_mult,
      },
    ].map((data: MultiplierListItemData) =>
      Object.defineProperty(data, "color", {
        value: Settings.theme.combat,
      }),
    ),
    {
      mult: "Charisma Level",
      current: Player.charisma_mult,
      augmented: Player.charisma_mult * mults.charisma_mult,
      bnMult: BitNodeMultipliers.CharismaLevelMultiplier,
      color: Settings.theme.cha,
    },
    {
      mult: "Charisma Experience",
      current: Player.charisma_exp_mult,
      augmented: Player.charisma_exp_mult * mults.charisma_exp_mult,
      color: Settings.theme.cha,
    },
  ];
  const rightColData: MultiplierListItemData[] = [
    {
      mult: "Hacknet Node production",
      current: Player.hacknet_node_money_mult,
      augmented: Player.hacknet_node_money_mult * mults.hacknet_node_money_mult,
      bnMult: BitNodeMultipliers.HacknetNodeMoney,
    },
    {
      mult: "Hacknet Node purchase cost",
      current: Player.hacknet_node_purchase_cost_mult,
      augmented: Player.hacknet_node_purchase_cost_mult * mults.hacknet_node_purchase_cost_mult,
    },
    {
      mult: "Hacknet Node RAM upgrade cost",
      current: Player.hacknet_node_ram_cost_mult,
      augmented: Player.hacknet_node_ram_cost_mult * mults.hacknet_node_ram_cost_mult,
    },
    {
      mult: "Hacknet Node Core purchase cost",
      current: Player.hacknet_node_core_cost_mult,
      augmented: Player.hacknet_node_core_cost_mult * mults.hacknet_node_core_cost_mult,
    },
    {
      mult: "Hacknet Node level upgrade cost",
      current: Player.hacknet_node_level_cost_mult,
      augmented: Player.hacknet_node_level_cost_mult * mults.hacknet_node_level_cost_mult,
    },
    {
      mult: "Company reputation gain",
      current: Player.company_rep_mult,
      augmented: Player.company_rep_mult * mults.company_rep_mult,
    },
    {
      mult: "Faction reputation gain",
      current: Player.faction_rep_mult,
      augmented: Player.faction_rep_mult * mults.faction_rep_mult,
      bnMult: BitNodeMultipliers.FactionWorkRepGain,
    },
    {
      mult: "Salary",
      current: Player.work_money_mult,
      augmented: Player.work_money_mult * mults.work_money_mult,
      bnMult: BitNodeMultipliers.CompanyWorkMoney,
      color: Settings.theme.money,
    },
    {
      mult: "Crime success",
      current: Player.crime_success_mult,
      augmented: Player.crime_success_mult * mults.crime_success_mult,
      color: Settings.theme.combat,
    },
    {
      mult: "Crime money",
      current: Player.crime_money_mult,
      augmented: Player.crime_money_mult * mults.crime_money_mult,
      bnMult: BitNodeMultipliers.CrimeMoney,
      color: Settings.theme.money,
    },
  ];

  if (Player.canAccessBladeburner()) {
    rightColData.push(
      {
        mult: "Bladeburner Success Chance",
        current: Player.bladeburner_success_chance_mult,
        augmented: Player.bladeburner_success_chance_mult * mults.bladeburner_success_chance_mult,
      },
      {
        mult: "Bladeburner Max Stamina",
        current: Player.bladeburner_max_stamina_mult,
        augmented: Player.bladeburner_max_stamina_mult * mults.bladeburner_max_stamina_mult,
      },
      {
        mult: "Bladeburner Stamina Gain",
        current: Player.bladeburner_stamina_gain_mult,
        augmented: Player.bladeburner_stamina_gain_mult * mults.bladeburner_stamina_gain_mult,
      },
      {
        mult: "Bladeburner Field Analysis",
        current: Player.bladeburner_analysis_mult,
        augmented: Player.bladeburner_analysis_mult * mults.bladeburner_analysis_mult,
      },
    );
  }

  return (
    <Paper
      sx={{
        p: 1,
        maxHeight: 400,
        overflowY: "scroll",
        display: "flex",
        flexDirection: "column",
        flexWrap: "wrap",
        gap: 1,
      }}
    >
      <MultiplierList rows={leftColData} />
      <MultiplierList rows={rightColData} />
    </Paper>
  );
}
