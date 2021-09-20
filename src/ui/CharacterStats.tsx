import React, { useState, useEffect } from "react";

import { numeralWrapper } from "../ui/numeralFormat";
import { convertTimeMsToTimeElapsedString } from "../../utils/StringHelperFunctions";
import { BitNodeMultipliers } from "../BitNode/BitNodeMultipliers";
import { SourceFileFlags } from "../SourceFile/SourceFileFlags";
import { getPurchaseServerLimit } from "../Server/ServerPurchases";
import { HacknetServerConstants } from "../Hacknet/data/Constants";
import { StatsTable } from "./React/StatsTable";
import { Money } from "./React/Money";
import { use } from "./Context";
import { MoneySourceTracker } from "../utils/MoneySourceTracker";
import { BitNodes } from "../BitNode/BitNode";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Modal } from "./React/Modal";

import TableBody from "@mui/material/TableBody";
import { Table, TableCell } from "./React/Table";
import TableRow from "@mui/material/TableRow";

function LastEmployer(): React.ReactElement {
  const player = use.Player();
  if (player.companyName) {
    return <Typography>Employer at which you last worked: {player.companyName}</Typography>;
  }
  return <></>;
}

function LastJob(): React.ReactElement {
  const player = use.Player();
  if (player.companyName !== "") {
    return <Typography>Job you last worked: {player.jobs[player.companyName]}</Typography>;
  }
  return <></>;
}

function Employers(): React.ReactElement {
  const player = use.Player();
  if (player.jobs && Object.keys(player.jobs).length !== 0)
    return (
      <>
        <Typography>All Employers:</Typography>

        <ul>
          {Object.keys(player.jobs).map((j) => (
            <Typography key={j}> * {j}</Typography>
          ))}
        </ul>
      </>
    );
  return <></>;
}

function Hacknet(): React.ReactElement {
  const player = use.Player();
  // Can't import HacknetHelpers for some reason.
  if (!(player.bitNodeN === 9 || SourceFileFlags[9] > 0)) {
    return (
      <>
        <Typography>{`Hacknet Nodes owned: ${player.hacknetNodes.length}`}</Typography>
        <br />
      </>
    );
  } else {
    return (
      <>
        <Typography>{`Hacknet Servers owned: ${player.hacknetNodes.length} / ${HacknetServerConstants.MaxServers}`}</Typography>
        <br />
      </>
    );
  }
}

function Intelligence(): React.ReactElement {
  const player = use.Player();
  if (player.intelligence > 0 && (player.bitNodeN === 5 || SourceFileFlags[5] > 0)) {
    return (
      <TableRow>
        <TableCell>
          <Typography>Intelligence:&nbsp;</Typography>
        </TableCell>
        <TableCell align="right">
          <Typography>{numeralWrapper.formatSkill(player.intelligence)}&nbsp;</Typography>
        </TableCell>
      </TableRow>
    );
  }
  return <></>;
}

function MultiplierTable(props: any): React.ReactElement {
  function bn5Stat(r: any): JSX.Element {
    if (SourceFileFlags[5] > 0 && r.length > 2 && r[1] != r[2]) {
      return (
        <TableCell key="2" align="right">
          <Typography noWrap>({numeralWrapper.formatPercentage(r[2])})</Typography>
        </TableCell>
      );
    }
    return <></>;
  }
  return (
    <>
      <Table size="small" padding="none">
        <TableBody>
          {props.rows.map((r: any) => (
            <TableRow key={r[0]}>
              <TableCell key="0">
                <Typography noWrap>{`${r[0]} multiplier:`}&nbsp;</Typography>
              </TableCell>
              <TableCell key="1" align="right">
                <Typography noWrap>{numeralWrapper.formatPercentage(r[1])}</Typography>
              </TableCell>
              {bn5Stat(r)}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

function BladeburnerMults(): React.ReactElement {
  const player = use.Player();
  if (!player.canAccessBladeburner()) return <></>;
  return (
    <MultiplierTable
      rows={[
        ["Bladeburner Success Chance", player.bladeburner_max_stamina_mult],
        ["Bladeburner Max Stamina", player.bladeburner_stamina_gain_mult],
        ["Bladeburner Stamina Gain", player.bladeburner_analysis_mult],
        ["Bladeburner Field Analysis", player.bladeburner_success_chance_mult],
      ]}
    />
  );
}

function CurrentBitNode(): React.ReactElement {
  const player = use.Player();
  if (player.sourceFiles.length > 0) {
    const index = "BitNode" + player.bitNodeN;
    return (
      <>
        <Typography variant="h5" color="primary">
          BitNode {player.bitNodeN}: {BitNodes[index].name}
        </Typography>
        <Typography sx={{ mx: 2 }} style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}>
          {BitNodes[index].info}
        </Typography>
      </>
    );
  }

  return <></>;
}

interface IMoneyModalProps {
  open: boolean;
  onClose: () => void;
}

function MoneyModal({ open, onClose }: IMoneyModalProps): React.ReactElement {
  const player = use.Player();
  function convertMoneySourceTrackerToString(src: MoneySourceTracker): React.ReactElement {
    const parts: any[][] = [[`Total:`, <Money money={src.total} />]];
    if (src.bladeburner) {
      parts.push([`Bladeburner:`, <Money money={src.bladeburner} />]);
    }
    if (src.codingcontract) {
      parts.push([`Coding Contracts:`, <Money money={src.codingcontract} />]);
    }
    if (src.work) {
      parts.push([`Company Work:`, <Money money={src.work} />]);
    }
    if (src.class) {
      parts.push([`Class:`, <Money money={src.class} />]);
    }
    if (src.corporation) {
      parts.push([`Corporation:`, <Money money={src.corporation} />]);
    }
    if (src.crime) {
      parts.push([`Crimes:`, <Money money={src.crime} />]);
    }
    if (src.gang) {
      parts.push([`Gang:`, <Money money={src.gang} />]);
    }
    if (src.hacking) {
      parts.push([`Hacking:`, <Money money={src.hacking} />]);
    }
    if (src.hacknetnode) {
      parts.push([`Hacknet Nodes:`, <Money money={src.hacknetnode} />]);
    }
    if (src.hospitalization) {
      parts.push([`Hospitalization:`, <Money money={src.hospitalization} />]);
    }
    if (src.infiltration) {
      parts.push([`Infiltration:`, <Money money={src.infiltration} />]);
    }
    if (src.stock) {
      parts.push([`Stock Market:`, <Money money={src.stock} />]);
    }
    if (src.casino) {
      parts.push([`Casino:`, <Money money={src.casino} />]);
    }
    if (src.sleeves) {
      parts.push([`Sleeves:`, <Money money={src.sleeves} />]);
    }

    return <StatsTable rows={parts} wide />;
  }

  let content = (
    <>
      <Typography variant="h6" color="primary">
        Money earned since you last installed Augmentations
      </Typography>
      <br />
      {convertMoneySourceTrackerToString(player.moneySourceA)}
    </>
  );
  if (player.sourceFiles.length !== 0) {
    content = (
      <>
        {content}
        <br />
        <br />
        <Typography variant="h6" color="primary">
          Money earned in this BitNode
        </Typography>
        <br />
        {convertMoneySourceTrackerToString(player.moneySourceB)}
      </>
    );
  }

  return (
    <Modal open={open} onClose={onClose}>
      {content}
    </Modal>
  );
}

export function CharacterStats(): React.ReactElement {
  const player = use.Player();
  const [moneyOpen, setMoneyOpen] = useState(false);
  const setRerender = useState(false)[1];
  function rerender(): void {
    setRerender((old) => !old);
  }

  useEffect(() => {
    const id = setInterval(rerender, 20);
    return () => clearInterval(id);
  }, []);

  const timeRows = [
    ["Time played since last Augmentation:", convertTimeMsToTimeElapsedString(player.playtimeSinceLastAug)],
  ];
  if (player.sourceFiles.length > 0) {
    timeRows.push([
      "Time played since last Bitnode destroyed:",
      convertTimeMsToTimeElapsedString(player.playtimeSinceLastBitnode),
    ]);
  }
  timeRows.push(["Total Time played:", convertTimeMsToTimeElapsedString(player.totalPlaytime)]);

  return (
    <>
      <Typography variant="h5" color="primary">
        General
      </Typography>
      <Box sx={{ mx: 2 }}>
        <Typography>Current City: {player.city}</Typography>
        <LastEmployer />
        <LastJob />
        <Employers />

        <Typography>
          Money: <Money money={player.money.toNumber()} />
          <IconButton onClick={() => setMoneyOpen(true)}>
            <MoreHorizIcon color="info" />
          </IconButton>
        </Typography>
      </Box>
      <br />
      <Typography variant="h5" color="primary">
        Stats
      </Typography>
      <Box sx={{ mx: 2 }}>
        <Table size="small" padding="none">
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography noWrap>Hacking:&nbsp;</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography noWrap>{numeralWrapper.formatSkill(player.hacking_skill)}&nbsp;</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography noWrap>({numeralWrapper.formatExp(player.hacking_exp)} exp)</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>Strength:&nbsp;</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography noWrap>{numeralWrapper.formatSkill(player.strength)}&nbsp;</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography noWrap>({numeralWrapper.formatExp(player.strength_exp)} exp)</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>Defense:&nbsp;</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography noWrap>{numeralWrapper.formatSkill(player.defense)}&nbsp;</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography noWrap>({numeralWrapper.formatExp(player.defense_exp)} exp)</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>Dexterity:&nbsp;</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography noWrap>{numeralWrapper.formatSkill(player.dexterity)}&nbsp;</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography noWrap>({numeralWrapper.formatExp(player.dexterity_exp)} exp)</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>Agility:&nbsp;</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography noWrap>{numeralWrapper.formatSkill(player.agility)}&nbsp;</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography noWrap>({numeralWrapper.formatExp(player.agility_exp)} exp)</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>Charisma:&nbsp;</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography noWrap>{numeralWrapper.formatSkill(player.charisma)}&nbsp;</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography noWrap>({numeralWrapper.formatExp(player.charisma_exp)} exp)</Typography>
              </TableCell>
            </TableRow>
            <Intelligence />
          </TableBody>
        </Table>
        <br />
      </Box>
      <br />
      <Typography variant="h5" color="primary">
        Multipliers
      </Typography>
      <Box sx={{ mx: 2 }}>
        <MultiplierTable
          rows={[
            ["Hacking Chance", player.hacking_chance_mult],
            ["Hacking Speed", player.hacking_speed_mult],
            [
              "Hacking Money",
              player.hacking_money_mult,
              player.hacking_money_mult * BitNodeMultipliers.ScriptHackMoney,
            ],
            [
              "Hacking Growth",
              player.hacking_grow_mult,
              player.hacking_grow_mult * BitNodeMultipliers.ServerGrowthRate,
            ],
          ]}
        />
        <br />
        <MultiplierTable
          rows={[
            ["Hacking Level", player.hacking_mult, player.hacking_mult * BitNodeMultipliers.HackingLevelMultiplier],
            ["Hacking Experience", player.hacking_exp_mult, player.hacking_exp_mult * BitNodeMultipliers.HackExpGain],
          ]}
        />
        <br />

        <MultiplierTable
          rows={[
            ["Strength Level", player.strength_mult, player.strength_mult * BitNodeMultipliers.StrengthLevelMultiplier],
            ["Strength Experience", player.strength_exp_mult],
          ]}
        />
        <br />

        <MultiplierTable
          rows={[
            ["Defense Level", player.defense_mult, player.defense_mult * BitNodeMultipliers.DefenseLevelMultiplier],
            ["Defense Experience", player.defense_exp_mult],
          ]}
        />
        <br />

        <MultiplierTable
          rows={[
            [
              "Dexterity Level",
              player.dexterity_mult,
              player.dexterity_mult * BitNodeMultipliers.DexterityLevelMultiplier,
            ],
            ["Dexterity Experience", player.dexterity_exp_mult],
          ]}
        />
        <br />

        <MultiplierTable
          rows={[
            ["Agility Level", player.agility_mult, player.agility_mult * BitNodeMultipliers.AgilityLevelMultiplier],
            ["Agility Experience", player.agility_exp_mult],
          ]}
        />
        <br />

        <MultiplierTable
          rows={[
            ["Charisma Level", player.charisma_mult, player.charisma_mult * BitNodeMultipliers.CharismaLevelMultiplier],
            ["Charisma Experience", player.charisma_exp_mult],
          ]}
        />
        <br />

        <MultiplierTable
          rows={[
            [
              "Hacknet Node production",
              player.hacknet_node_money_mult,
              player.hacknet_node_money_mult * BitNodeMultipliers.HacknetNodeMoney,
            ],
            ["Hacknet Node purchase cost", player.hacknet_node_purchase_cost_mult],
            ["Hacknet Node RAM upgrade cost", player.hacknet_node_ram_cost_mult],
            ["Hacknet Node Core purchase cost", player.hacknet_node_core_cost_mult],
            ["Hacknet Node level upgrade cost", player.hacknet_node_level_cost_mult],
          ]}
        />
        <br />

        <MultiplierTable
          rows={[
            ["Company reputation gain", player.company_rep_mult],
            [
              "Faction reputation gain",
              player.faction_rep_mult,
              player.faction_rep_mult * BitNodeMultipliers.FactionWorkRepGain,
            ],
            ["Salary", player.work_money_mult, player.work_money_mult * BitNodeMultipliers.CompanyWorkMoney],
          ]}
        />
        <br />

        <MultiplierTable
          rows={[
            ["Crime success", player.crime_success_mult],
            ["Crime money", player.crime_money_mult, player.crime_money_mult * BitNodeMultipliers.CrimeMoney],
          ]}
        />
        <br />
        <BladeburnerMults />
      </Box>
      <br />

      <Typography variant="h5" color="primary">
        Misc
      </Typography>
      <Box sx={{ mx: 2 }}>
        <Typography>{`Servers owned: ${player.purchasedServers.length} / ${getPurchaseServerLimit()}`}</Typography>
        <Hacknet />
        <Typography>{`Augmentations installed: ${player.augmentations.length}`}</Typography>
        <StatsTable rows={timeRows} />
      </Box>
      <br />
      <CurrentBitNode />
      <MoneyModal open={moneyOpen} onClose={() => setMoneyOpen(false)} />
    </>
  );
}
