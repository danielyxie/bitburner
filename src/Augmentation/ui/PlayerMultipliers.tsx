/**
 * React component for displaying the player's multipliers on the Augmentation UI page
 */
import { DoubleArrow } from "@mui/icons-material";
import { List, ListItem, ListItemText, Paper, Typography } from "@mui/material";
import * as React from "react";
import { BitNodeMultipliers } from "../../BitNode/BitNodeMultipliers";
import { Player } from "../../Player";
import { Settings } from "../../Settings/Settings";
import { SourceFileFlags } from "../../SourceFile/SourceFileFlags";
import { numeralWrapper } from "../../ui/numeralFormat";
import { Augmentations } from "../Augmentations";

interface IAugmentedStats {
  [index: string]: number;
}

function calculateAugmentedStats(): IAugmentedStats {
  const augP: IAugmentedStats = {};
  for (const aug of Player.queuedAugmentations) {
    const augObj = Augmentations[aug.name];
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
  if (props.mult === 1 || SourceFileFlags[5] === 0)
    return <Typography color={props.color}>{numeralWrapper.formatPercentage(props.base)}</Typography>;

  return (
    <Typography color={props.color}>
      <span style={{ opacity: 0.5 }}>{numeralWrapper.formatPercentage(props.base)}</span>{" "}
      {numeralWrapper.formatPercentage(props.base * props.mult)}
    </Typography>
  );
}

type MultiplierListItemData = [
  multiplier: string,
  currentValue: number,
  augmentedValue: number,
  bitNodeMultiplier: number,
  color: string,
];

interface IMultiplierListProps {
  rows: MultiplierListItemData[];
  noMargin?: boolean;
}

function MultiplierList({ rows, noMargin = false }: IMultiplierListProps): React.ReactElement {
  const listItems = rows
    .map((data) => {
      const mult = data[0],
        value = data[1],
        improved = data[2],
        bnMult = data[3],
        color = data[4];

      if (improved) {
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
                  <BitNodeModifiedStats base={value} mult={bnMult} color={color} />
                  <DoubleArrow fontSize="small" color="success" sx={{ mb: 0.5, mx: 1 }} />
                  <BitNodeModifiedStats base={improved} mult={bnMult} color={Settings.theme.success} />
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

  if (listItems.length > 0) {
    return (
      <List disablePadding sx={{ mb: noMargin ? 0 : 2 }}>
        {listItems}
      </List>
    );
  }
  return <></>;
}

export function PlayerMultipliers(): React.ReactElement {
  const mults = calculateAugmentedStats();

  const leftColData: MultiplierListItemData[] = [
    ...[
      ["Hacking Chance ", Player.hacking_chance_mult, Player.hacking_chance_mult * mults.hacking_chance_mult, 1],
      ["Hacking Speed ", Player.hacking_speed_mult, Player.hacking_speed_mult * mults.hacking_speed_mult, 1],
      ["Hacking Money ", Player.hacking_money_mult, Player.hacking_money_mult * mults.hacking_money_mult, 1],
      ["Hacking Growth ", Player.hacking_grow_mult, Player.hacking_grow_mult * mults.hacking_grow_mult, 1],
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
    ].map((data): MultiplierListItemData => (data as any).concat([Settings.theme.hack])),
    ...[
      [
        "Strength Level ",
        Player.strength_mult,
        Player.strength_mult * mults.strength_mult,
        BitNodeMultipliers.StrengthLevelMultiplier,
      ],
      ["Strength Experience ", Player.strength_exp_mult, Player.strength_exp_mult * mults.strength_exp_mult, 1],
      [
        "Defense Level ",
        Player.defense_mult,
        Player.defense_mult * mults.defense_mult,
        BitNodeMultipliers.DefenseLevelMultiplier,
      ],
      ["Defense Experience ", Player.defense_exp_mult, Player.defense_exp_mult * mults.defense_exp_mult, 1],
      [
        "Dexterity Level ",
        Player.dexterity_mult,
        Player.dexterity_mult * mults.dexterity_mult,
        BitNodeMultipliers.DexterityLevelMultiplier,
      ],
      ["Dexterity Experience ", Player.dexterity_exp_mult, Player.dexterity_exp_mult * mults.dexterity_exp_mult, 1],
      [
        "Agility Level ",
        Player.agility_mult,
        Player.agility_mult * mults.agility_mult,
        BitNodeMultipliers.AgilityLevelMultiplier,
      ],
      ["Agility Experience ", Player.agility_exp_mult, Player.agility_exp_mult * mults.agility_exp_mult, 1],
    ].map((data): MultiplierListItemData => (data as any).concat([Settings.theme.combat])),
    [
      "Charisma Level ",
      Player.charisma_mult,
      Player.charisma_mult * mults.charisma_mult,
      BitNodeMultipliers.CharismaLevelMultiplier,
      Settings.theme.cha,
    ],
    [
      "Charisma Experience ",
      Player.charisma_exp_mult,
      Player.charisma_exp_mult * mults.charisma_exp_mult,
      1,
      Settings.theme.cha,
    ],
  ];
  const rightColData: MultiplierListItemData[] = [
    ...[
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
      ["Company reputation gain ", Player.company_rep_mult, Player.company_rep_mult * mults.company_rep_mult, 1],
      [
        "Faction reputation gain ",
        Player.faction_rep_mult,
        Player.faction_rep_mult * mults.faction_rep_mult,
        BitNodeMultipliers.FactionWorkRepGain,
      ],
    ].map((data): MultiplierListItemData => (data as any).concat([Settings.theme.primary])),
    [
      "Salary ",
      Player.work_money_mult,
      Player.work_money_mult * mults.work_money_mult,
      BitNodeMultipliers.CompanyWorkMoney,
      Settings.theme.money,
    ],
    [
      "Crime success ",
      Player.crime_success_mult,
      Player.crime_success_mult * mults.crime_success_mult,
      1,
      Settings.theme.combat,
    ],
    [
      "Crime money ",
      Player.crime_money_mult,
      Player.crime_money_mult * mults.crime_money_mult,
      BitNodeMultipliers.CrimeMoney,
      Settings.theme.money,
    ],
  ];

  if (Player.canAccessBladeburner()) {
    rightColData.push(
      ...[
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
      ].map((data): MultiplierListItemData => (data as any).concat([Settings.theme.primary])),
    );
  }

  const hasLeftImprovements = +!!(leftColData.filter((item) => item[2] !== 0).length > 0),
    hasRightImprovements = +!!(rightColData.filter((item) => item[2] !== 0).length > 0);

  return (
    <Paper
      sx={{
        p: 1,
        maxHeight: 400,
        overflowY: "scroll",
        display: "grid",
        gridTemplateColumns: `repeat(${hasLeftImprovements + hasRightImprovements}, 1fr)`,
      }}
    >
      <MultiplierList rows={leftColData} />
      <MultiplierList rows={rightColData} />
    </Paper>
  );
}
