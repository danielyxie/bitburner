/**
 * React component for displaying the player's multipliers on the Augmentation UI page
 */
import { DoubleArrow } from "@mui/icons-material";
import { List, ListItem, ListItemText, Paper, Typography } from "@mui/material";
import * as React from "react";
import { Multipliers, defaultMultipliers, mergeMultipliers } from "../../PersonObjects/Multipliers";
import { BitNodeMultipliers } from "../../BitNode/BitNodeMultipliers";
import { Player } from "../../Player";
import { Settings } from "../../Settings/Settings";
import { numeralWrapper } from "../../ui/numeralFormat";
import { StaticAugmentations } from "../StaticAugmentations";

function calculateAugmentedStats(): Multipliers {
  let augP: Multipliers = defaultMultipliers();
  for (const aug of Player.queuedAugmentations) {
    const augObj = StaticAugmentations[aug.name];
    augP = mergeMultipliers(augP, augObj.mults);
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
        current: Player.mults.hacking_chance,
        augmented: Player.mults.hacking_chance * mults.hacking_chance,
      },
      {
        mult: "Hacking Speed",
        current: Player.mults.hacking_speed,
        augmented: Player.mults.hacking_speed * mults.hacking_speed,
      },
      {
        mult: "Hacking Money",
        current: Player.mults.hacking_money,
        augmented: Player.mults.hacking_money * mults.hacking_money,
        bnMult: BitNodeMultipliers.ScriptHackMoney,
      },
      {
        mult: "Hacking Growth",
        current: Player.mults.hacking_grow,
        augmented: Player.mults.hacking_grow * mults.hacking_grow,
      },
      {
        mult: "Hacking Level",
        current: Player.mults.hacking,
        augmented: Player.mults.hacking * mults.hacking,
        bnMult: BitNodeMultipliers.HackingLevelMultiplier,
      },
      {
        mult: "Hacking Experience",
        current: Player.mults.hacking_exp,
        augmented: Player.mults.hacking_exp * mults.hacking_exp,
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
        current: Player.mults.strength,
        augmented: Player.mults.strength * mults.strength,
        bnMult: BitNodeMultipliers.StrengthLevelMultiplier,
      },
      {
        mult: "Strength Experience",
        current: Player.mults.strength_exp,
        augmented: Player.mults.strength_exp * mults.strength_exp,
      },
      {
        mult: "Defense Level",
        current: Player.mults.defense,
        augmented: Player.mults.defense * mults.defense,
        bnMult: BitNodeMultipliers.DefenseLevelMultiplier,
      },
      {
        mult: "Defense Experience",
        current: Player.mults.defense_exp,
        augmented: Player.mults.defense_exp * mults.defense_exp,
      },
      {
        mult: "Dexterity Level",
        current: Player.mults.dexterity,
        augmented: Player.mults.dexterity * mults.dexterity,
        bnMult: BitNodeMultipliers.DexterityLevelMultiplier,
      },
      {
        mult: "Dexterity Experience",
        current: Player.mults.dexterity_exp,
        augmented: Player.mults.dexterity_exp * mults.dexterity_exp,
      },
      {
        mult: "Agility Level",
        current: Player.mults.agility,
        augmented: Player.mults.agility * mults.agility,
        bnMult: BitNodeMultipliers.AgilityLevelMultiplier,
      },
      {
        mult: "Agility Experience",
        current: Player.mults.agility_exp,
        augmented: Player.mults.agility_exp * mults.agility_exp,
      },
    ].map((data: MultiplierListItemData) =>
      Object.defineProperty(data, "color", {
        value: Settings.theme.combat,
      }),
    ),
    {
      mult: "Charisma Level",
      current: Player.mults.charisma,
      augmented: Player.mults.charisma * mults.charisma,
      bnMult: BitNodeMultipliers.CharismaLevelMultiplier,
      color: Settings.theme.cha,
    },
    {
      mult: "Charisma Experience",
      current: Player.mults.charisma_exp,
      augmented: Player.mults.charisma_exp * mults.charisma_exp,
      color: Settings.theme.cha,
    },
  ];
  const rightColData: MultiplierListItemData[] = [
    {
      mult: "Hacknet Node Production",
      current: Player.mults.hacknet_node_money,
      augmented: Player.mults.hacknet_node_money * mults.hacknet_node_money,
      bnMult: BitNodeMultipliers.HacknetNodeMoney,
    },
    {
      mult: "Hacknet Node Purchase Cost",
      current: Player.mults.hacknet_node_purchase_cost,
      augmented: Player.mults.hacknet_node_purchase_cost * mults.hacknet_node_purchase_cost,
    },
    {
      mult: "Hacknet Node RAM Upgrade Cost",
      current: Player.mults.hacknet_node_ram_cost,
      augmented: Player.mults.hacknet_node_ram_cost * mults.hacknet_node_ram_cost,
    },
    {
      mult: "Hacknet Node Core Purchase Cost",
      current: Player.mults.hacknet_node_core_cost,
      augmented: Player.mults.hacknet_node_core_cost * mults.hacknet_node_core_cost,
    },
    {
      mult: "Hacknet Node Level Upgrade Cost",
      current: Player.mults.hacknet_node_level_cost,
      augmented: Player.mults.hacknet_node_level_cost * mults.hacknet_node_level_cost,
    },
    {
      mult: "Company Reputation Gain",
      current: Player.mults.company_rep,
      augmented: Player.mults.company_rep * mults.company_rep,
    },
    {
      mult: "Faction Reputation Gain",
      current: Player.mults.faction_rep,
      augmented: Player.mults.faction_rep * mults.faction_rep,
      bnMult: BitNodeMultipliers.FactionWorkRepGain,
    },
    {
      mult: "Salary",
      current: Player.mults.work_money,
      augmented: Player.mults.work_money * mults.work_money,
      bnMult: BitNodeMultipliers.CompanyWorkMoney,
      color: Settings.theme.money,
    },
    {
      mult: "Crime Success Chance",
      current: Player.mults.crime_success,
      augmented: Player.mults.crime_success * mults.crime_success,
      color: Settings.theme.combat,
    },
    {
      mult: "Crime Money",
      current: Player.mults.crime_money,
      augmented: Player.mults.crime_money * mults.crime_money,
      bnMult: BitNodeMultipliers.CrimeMoney,
      color: Settings.theme.money,
    },
  ];

  if (Player.canAccessBladeburner() && BitNodeMultipliers.BladeburnerRank > 0) {
    rightColData.push(
      {
        mult: "Bladeburner Success Chance",
        current: Player.mults.bladeburner_success_chance,
        augmented: Player.mults.bladeburner_success_chance * mults.bladeburner_success_chance,
      },
      {
        mult: "Bladeburner Max Stamina",
        current: Player.mults.bladeburner_max_stamina,
        augmented: Player.mults.bladeburner_max_stamina * mults.bladeburner_max_stamina,
      },
      {
        mult: "Bladeburner Stamina Gain",
        current: Player.mults.bladeburner_stamina_gain,
        augmented: Player.mults.bladeburner_stamina_gain * mults.bladeburner_stamina_gain,
      },
      {
        mult: "Bladeburner Field Analysis",
        current: Player.mults.bladeburner_analysis,
        augmented: Player.mults.bladeburner_analysis * mults.bladeburner_analysis,
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
