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

type MultiplierListItemData = [
  multiplier: string,
  currentValue: number,
  augmentedValue: number,
  bitNodeMultiplier: number,
  color: string,
];

interface IMultiplierListProps {
  rows: MultiplierListItemData[];
}

function MultiplierList(props: IMultiplierListProps): React.ReactElement {
  const listItems = props.rows
    .map((data) => {
      const [multiplier, currentValue, augmentedValue, bitNodeMultiplier, color] = data;

      if (!isNaN(augmentedValue)) {
        return (
          <ListItem key={multiplier} disableGutters sx={{ py: 0 }}>
            <ListItemText
              sx={{ my: 0.1 }}
              primary={
                <Typography color={color}>
                  <b>{multiplier}</b>
                </Typography>
              }
              secondary={
                <span style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                  <BitNodeModifiedStats base={currentValue} mult={bitNodeMultiplier} color={color} />
                  <DoubleArrow fontSize="small" color="success" sx={{ mb: 0.5, mx: 1 }} />
                  <BitNodeModifiedStats base={augmentedValue} mult={bitNodeMultiplier} color={Settings.theme.success} />
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

  // Column data is a bit janky, so it's set up here to allow for
  // easier logic in setting up the layout
  const leftColData: MultiplierListItemData[] = [
    ...[
      ["Hacking Chance ", Player.mults.hacking_chance, Player.mults.hacking_chance * mults.hacking_chance_mult, 1],
      ["Hacking Speed ", Player.mults.hacking_speed, Player.mults.hacking_speed * mults.hacking_speed_mult, 1],
      ["Hacking Money ", Player.mults.hacking_money, Player.mults.hacking_money * mults.hacking_money_mult, 1],
      ["Hacking Growth ", Player.mults.hacking_money, Player.mults.hacking_money * mults.hacking_grow_mult, 1],
      [
        "Hacking Level ",
        Player.mults.hacking,
        Player.mults.hacking * mults.hacking_mult,
        BitNodeMultipliers.HackingLevelMultiplier,
      ],
      [
        "Hacking Experience ",
        Player.mults.hacking_exp,
        Player.mults.hacking_exp * mults.hacking_exp_mult,
        BitNodeMultipliers.HackExpGain,
      ],
    ].map((data): MultiplierListItemData => (data as any).concat([Settings.theme.hack])),
    ...[
      [
        "Strength Level ",
        Player.mults.strength,
        Player.mults.strength * mults.strength_mult,
        BitNodeMultipliers.StrengthLevelMultiplier,
      ],
      ["Strength Experience ", Player.mults.strength_exp, Player.mults.strength_exp * mults.strength_exp_mult, 1],
      [
        "Defense Level ",
        Player.mults.defense,
        Player.mults.defense * mults.defense_mult,
        BitNodeMultipliers.DefenseLevelMultiplier,
      ],
      ["Defense Experience ", Player.mults.defense_exp, Player.mults.defense_exp * mults.defense_exp_mult, 1],
      [
        "Dexterity Level ",
        Player.mults.dexterity,
        Player.mults.dexterity * mults.dexterity_mult,
        BitNodeMultipliers.DexterityLevelMultiplier,
      ],
      ["Dexterity Experience ", Player.mults.dexterity_exp, Player.mults.dexterity_exp * mults.dexterity_exp_mult, 1],
      [
        "Agility Level ",
        Player.mults.agility,
        Player.mults.agility * mults.agility_mult,
        BitNodeMultipliers.AgilityLevelMultiplier,
      ],
      ["Agility Experience ", Player.mults.agility_exp, Player.mults.agility_exp * mults.agility_exp_mult, 1],
    ].map((data): MultiplierListItemData => (data as any).concat([Settings.theme.combat])),
    [
      "Charisma Level ",
      Player.mults.charisma,
      Player.mults.charisma * mults.charisma_mult,
      BitNodeMultipliers.CharismaLevelMultiplier,
      Settings.theme.cha,
    ],
    [
      "Charisma Experience ",
      Player.mults.charisma_exp,
      Player.mults.charisma_exp * mults.charisma_exp_mult,
      1,
      Settings.theme.cha,
    ],
  ];
  const rightColData: MultiplierListItemData[] = [
    ...[
      [
        "Hacknet Node production ",
        Player.mults.hacknet_node_money,
        Player.mults.hacknet_node_money * mults.hacknet_node_money_mult,
        BitNodeMultipliers.HacknetNodeMoney,
      ],
      [
        "Hacknet Node purchase cost ",
        Player.mults.hacknet_node_purchase_cost,
        Player.mults.hacknet_node_purchase_cost * mults.hacknet_node_purchase_cost_mult,
        1,
      ],
      [
        "Hacknet Node RAM upgrade cost ",
        Player.mults.hacknet_node_ram_cost,
        Player.mults.hacknet_node_ram_cost * mults.hacknet_node_ram_cost_mult,
        1,
      ],
      [
        "Hacknet Node Core purchase cost ",
        Player.mults.hacknet_node_core_cost,
        Player.mults.hacknet_node_core_cost * mults.hacknet_node_core_cost_mult,
        1,
      ],
      [
        "Hacknet Node level upgrade cost ",
        Player.mults.hacknet_node_level_cost,
        Player.mults.hacknet_node_level_cost * mults.hacknet_node_level_cost_mult,
        1,
      ],
      ["Company reputation gain ", Player.mults.company_rep, Player.mults.company_rep * mults.company_rep_mult, 1],
      [
        "Faction reputation gain ",
        Player.mults.faction_rep,
        Player.mults.faction_rep * mults.faction_rep_mult,
        BitNodeMultipliers.FactionWorkRepGain,
      ],
    ].map((data): MultiplierListItemData => (data as any).concat([Settings.theme.primary])),
    [
      "Salary ",
      Player.mults.work_money,
      Player.mults.work_money * mults.work_money_mult,
      BitNodeMultipliers.CompanyWorkMoney,
      Settings.theme.money,
    ],
    [
      "Crime success ",
      Player.mults.crime_success,
      Player.mults.crime_success * mults.crime_success_mult,
      1,
      Settings.theme.combat,
    ],
    [
      "Crime money ",
      Player.mults.crime_money,
      Player.mults.crime_money * mults.crime_money_mult,
      BitNodeMultipliers.CrimeMoney,
      Settings.theme.money,
    ],
  ];

  if (Player.canAccessBladeburner()) {
    rightColData.push(
      ...[
        [
          "Bladeburner Success Chance",
          Player.mults.bladeburner_success_chance,
          Player.mults.bladeburner_success_chance * mults.bladeburner_success_chance_mult,
          1,
        ],
        [
          "Bladeburner Max Stamina",
          Player.mults.bladeburner_max_stamina,
          Player.mults.bladeburner_max_stamina * mults.bladeburner_max_stamina_mult,
          1,
        ],
        [
          "Bladeburner Stamina Gain",
          Player.mults.bladeburner_stamina_gain,
          Player.mults.bladeburner_stamina_gain * mults.bladeburner_stamina_gain_mult,
          1,
        ],
        [
          "Bladeburner Field Analysis",
          Player.mults.bladeburner_analysis,
          Player.mults.bladeburner_analysis * mults.bladeburner_analysis_mult,
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
