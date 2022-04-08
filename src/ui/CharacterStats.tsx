import { Paper, Table, TableBody, Box, IconButton, Typography, Container, Tooltip } from "@mui/material";
import { MoreHoriz, Info } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { BitNodes } from "../BitNode/BitNode";
import { BitNodeMultipliers } from "../BitNode/BitNodeMultipliers";
import { HacknetServerConstants } from "../Hacknet/data/Constants";
import { getPurchaseServerLimit } from "../Server/ServerPurchases";
import { Settings } from "../Settings/Settings";
import { SourceFileFlags } from "../SourceFile/SourceFileFlags";
import { MoneySourceTracker } from "../utils/MoneySourceTracker";
import { convertTimeMsToTimeElapsedString } from "../utils/StringHelperFunctions";
import { use } from "./Context";
import { numeralWrapper } from "./numeralFormat";
import { Modal } from "./React/Modal";
import { Money } from "./React/Money";
import { StatsRow } from "./React/StatsRow";
import { StatsTable } from "./React/StatsTable";

interface EmployersModalProps {
  open: boolean;
  onClose: () => void;
}

const EmployersModal = ({ open, onClose }: EmployersModalProps): React.ReactElement => {
  const player = use.Player();
  return (
    <Modal open={open} onClose={onClose}>
      <>
        <Typography variant="h5">All Employers</Typography>
        <ul>
          {Object.keys(player.jobs).map((j) => (
            <Typography key={j}>* {j}</Typography>
          ))}
        </ul>
      </>
    </Modal>
  );
};

interface MultTableProps {
  rows: (string | number)[][];
  color: string;
  noMargin?: boolean;
}

function MultiplierTable(props: MultTableProps): React.ReactElement {
  return (
    <Table sx={{ display: "table", width: "100%", mb: (props.noMargin ?? false) === true ? 0 : 2 }}>
      <TableBody>
        {props.rows.map((data) => {
          const mult = data[0] as string,
            value = data[1] as number,
            modded = data[2] as number | null;

          if (modded && modded !== value && SourceFileFlags[5] > 0) {
            return (
              <StatsRow key={mult} name={mult} color={props.color} data={{}}>
                <>
                  <Typography color={props.color}>
                    <span style={{ opacity: 0.5 }}>{numeralWrapper.formatPercentage(value)}</span>{" "}
                    {numeralWrapper.formatPercentage(modded)}
                  </Typography>
                </>
              </StatsRow>
            );
          }
          return (
            <StatsRow
              key={mult}
              name={mult}
              color={props.color}
              data={{ content: numeralWrapper.formatPercentage(value) }}
            />
          );
        })}
      </TableBody>
    </Table>
  );
}

function CurrentBitNode(): React.ReactElement {
  const player = use.Player();
  if (player.sourceFiles.length > 0) {
    const index = "BitNode" + player.bitNodeN;
    const currentSourceFile = player.sourceFiles.find((sourceFile) => sourceFile.n == player.bitNodeN);
    const lvl = currentSourceFile ? currentSourceFile.lvl : 0;
    return (
      <Box>
        <Paper sx={{ p: 1 }}>
          <Typography variant="h5">
            BitNode {player.bitNodeN}: {BitNodes[index].name} (Level {lvl})
          </Typography>
          <Typography sx={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}>{BitNodes[index].info}</Typography>
        </Paper>
      </Box>
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
    if (src.augmentations) {
      parts.push([`Augmentations:`, <Money money={src.augmentations} />]);
    }
    if (src.bladeburner) {
      parts.push([`Bladeburner:`, <Money money={src.bladeburner} />]);
    }
    if (src.casino) {
      parts.push([`Casino:`, <Money money={src.casino} />]);
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
    if (src.hacknet) {
      parts.push([`Hacknet Nodes:`, <Money money={src.hacknet} />]);
    }
    if (src.hacknet_expenses) {
      parts.push([`Hacknet Nodes Expenses:`, <Money money={src.hacknet_expenses} />]);
    }
    if (src.hospitalization) {
      parts.push([`Hospitalization:`, <Money money={src.hospitalization} />]);
    }
    if (src.infiltration) {
      parts.push([`Infiltration:`, <Money money={src.infiltration} />]);
    }
    if (src.servers) {
      parts.push([`Servers:`, <Money money={src.servers} />]);
    }
    if (src.stock) {
      parts.push([`Stock Market:`, <Money money={src.stock} />]);
    }
    if (src.sleeves) {
      parts.push([`Sleeves:`, <Money money={src.sleeves} />]);
    }
    if (src.other) {
      parts.push([`Other:`, <Money money={src.other} />]);
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
  const [employersOpen, setEmployersOpen] = useState(false);
  const setRerender = useState(false)[1];
  function rerender(): void {
    setRerender((old) => !old);
  }

  useEffect(() => {
    const id = setInterval(rerender, 200);
    return () => clearInterval(id);
  }, []);

  const timeRows = [
    ["Since last Augmentation installation", convertTimeMsToTimeElapsedString(player.playtimeSinceLastAug)],
  ];
  if (player.sourceFiles.length > 0) {
    timeRows.push(["Since last Bitnode destroyed", convertTimeMsToTimeElapsedString(player.playtimeSinceLastBitnode)]);
  }
  timeRows.push(["Total", convertTimeMsToTimeElapsedString(player.totalPlaytime)]);

  return (
    <Container maxWidth="lg" disableGutters sx={{ mx: 0 }}>
      <Typography variant="h4">Stats</Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", minWidth: "fit-content", mb: 1, gap: 1 }}>
        <Paper sx={{ p: 1 }}>
          <Typography variant="h5">General</Typography>
          <Table>
            <TableBody>
              <StatsRow name="Current City" color={Settings.theme.primary} data={{ content: player.city }} />
              <StatsRow name="Money" color={Settings.theme.money} data={{}}>
                <>
                  <Money money={player.money} />
                  <IconButton onClick={() => setMoneyOpen(true)} sx={{ p: 0 }}>
                    <MoreHoriz color="info" />
                  </IconButton>
                </>
              </StatsRow>
              {player.companyName && (
                <>
                  <StatsRow
                    name="Last Employer"
                    color={Settings.theme.primary}
                    data={{ content: player.companyName }}
                  />
                  <StatsRow
                    name="Last Job"
                    color={Settings.theme.primary}
                    data={{ content: player.jobs[player.companyName] }}
                  />
                </>
              )}
              {player.jobs && Object.keys(player.jobs).length !== 0 && (
                <StatsRow name="All Employers" color={Settings.theme.primary} data={{}}>
                  <>
                    <span style={{ color: Settings.theme.primary }}>{Object.keys(player.jobs).length} total</span>
                    <IconButton onClick={() => setEmployersOpen(true)} sx={{ p: 0 }}>
                      <MoreHoriz color="info" />
                    </IconButton>
                  </>
                </StatsRow>
              )}
              <StatsRow
                name="Servers Owned"
                color={Settings.theme.primary}
                data={{ content: `${player.purchasedServers.length} / ${getPurchaseServerLimit()}` }}
              />
              <StatsRow
                name={`Hacknet ${player.bitNodeN === 9 || SourceFileFlags[9] > 0 ? "Servers" : "Nodes"} owned`}
                color={Settings.theme.primary}
                data={{
                  content: `${player.hacknetNodes.length}${
                    player.bitNodeN === 9 || SourceFileFlags[9] > 0 ? ` / ${HacknetServerConstants.MaxServers}` : ""
                  }`,
                }}
              />
              <StatsRow
                name="Augmentations Installed"
                color={Settings.theme.primary}
                data={{ content: String(player.augmentations.length) }}
              />
            </TableBody>
          </Table>
        </Paper>
        <Paper sx={{ p: 1 }}>
          <Typography variant="h5">Skills</Typography>
          <Table>
            <TableBody>
              <StatsRow
                name="Hacking"
                color={Settings.theme.hack}
                data={{ level: player.hacking, exp: player.hacking_exp }}
              />
              <StatsRow
                name="Strength"
                color={Settings.theme.combat}
                data={{ level: player.strength, exp: player.strength_exp }}
              />
              <StatsRow
                name="Defense"
                color={Settings.theme.combat}
                data={{ level: player.defense, exp: player.defense_exp }}
              />
              <StatsRow
                name="Dexterity"
                color={Settings.theme.combat}
                data={{ level: player.dexterity, exp: player.dexterity_exp }}
              />
              <StatsRow
                name="Agility"
                color={Settings.theme.combat}
                data={{ level: player.agility, exp: player.agility_exp }}
              />
              <StatsRow
                name="Charisma"
                color={Settings.theme.cha}
                data={{ level: player.charisma, exp: player.charisma_exp }}
              />
              {player.intelligence > 0 && (player.bitNodeN === 5 || SourceFileFlags[5] > 0) && (
                <StatsRow
                  name="Intelligence"
                  color={Settings.theme.int}
                  data={{ level: player.intelligence, exp: player.intelligence_exp }}
                />
              )}
            </TableBody>
          </Table>
        </Paper>
      </Box>
      <Box sx={{ mb: 1 }}>
        <Paper sx={{ p: 1 }}>
          <Typography variant="h5" color="primary" sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
            Multipliers
            {SourceFileFlags[5] > 0 && (
              <Tooltip
                title={
                  <Typography>
                    Displays your current multipliers.
                    <br />
                    <br />
                    When there is a dim number next to a multiplier, that means that the multiplier in question is being
                    affected by BitNode multipliers.
                    <br />
                    <br />
                    The dim number is the raw multiplier, and the undimmed number is the effective multiplier, as
                    dictated by the BitNode.
                  </Typography>
                }
              >
                <Info sx={{ ml: 1, mb: 0.5 }} color="info" />
              </Tooltip>
            )}
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
            <Box>
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
                color={Settings.theme.hack}
              />
              <MultiplierTable
                rows={[
                  [
                    "Hacking Level",
                    player.hacking_mult,
                    player.hacking_mult * BitNodeMultipliers.HackingLevelMultiplier,
                  ],
                  [
                    "Hacking Experience",
                    player.hacking_exp_mult,
                    player.hacking_exp_mult * BitNodeMultipliers.HackExpGain,
                  ],
                ]}
                color={Settings.theme.hack}
              />
              <MultiplierTable
                rows={[
                  [
                    "Strength Level",
                    player.strength_mult,
                    player.strength_mult * BitNodeMultipliers.StrengthLevelMultiplier,
                  ],
                  ["Strength Experience", player.strength_exp_mult],
                ]}
                color={Settings.theme.combat}
              />
              <MultiplierTable
                rows={[
                  [
                    "Defense Level",
                    player.defense_mult,
                    player.defense_mult * BitNodeMultipliers.DefenseLevelMultiplier,
                  ],
                  ["Defense Experience", player.defense_exp_mult],
                ]}
                color={Settings.theme.combat}
              />
              <MultiplierTable
                rows={[
                  [
                    "Dexterity Level",
                    player.dexterity_mult,
                    player.dexterity_mult * BitNodeMultipliers.DexterityLevelMultiplier,
                  ],
                  ["Dexterity Experience", player.dexterity_exp_mult],
                ]}
                color={Settings.theme.combat}
              />
              <MultiplierTable
                rows={[
                  [
                    "Agility Level",
                    player.agility_mult,
                    player.agility_mult * BitNodeMultipliers.AgilityLevelMultiplier,
                  ],
                  ["Agility Experience", player.agility_exp_mult],
                ]}
                color={Settings.theme.combat}
              />
              <MultiplierTable
                rows={[
                  [
                    "Charisma Level",
                    player.charisma_mult,
                    player.charisma_mult * BitNodeMultipliers.CharismaLevelMultiplier,
                  ],
                  ["Charisma Experience", player.charisma_exp_mult],
                ]}
                color={Settings.theme.cha}
                noMargin
              />
            </Box>

            <Box>
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
                color={Settings.theme.primary}
              />
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
                color={Settings.theme.primary}
              />
              <MultiplierTable
                rows={[
                  ["Crime success", player.crime_success_mult],
                  ["Crime money", player.crime_money_mult, player.crime_money_mult * BitNodeMultipliers.CrimeMoney],
                ]}
                color={Settings.theme.combat}
              />
              {player.canAccessBladeburner() && (
                <MultiplierTable
                  rows={[
                    ["Bladeburner Success Chance", player.bladeburner_success_chance_mult],
                    ["Bladeburner Max Stamina", player.bladeburner_max_stamina_mult],
                    ["Bladeburner Stamina Gain", player.bladeburner_stamina_gain_mult],
                    ["Bladeburner Field Analysis", player.bladeburner_analysis_mult],
                  ]}
                  color={Settings.theme.primary}
                  noMargin
                />
              )}
            </Box>
          </Box>
        </Paper>
      </Box>

      <Box sx={{ mb: 1 }}>
        <Paper sx={{ p: 1 }}>
          <Typography variant="h5">Time Played</Typography>
          <Table>
            <TableBody>
              {timeRows.map(([name, content]) => (
                <StatsRow key={name} name={name} color={Settings.theme.primary} data={{ content: content }} />
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
      <CurrentBitNode />
      <MoneyModal open={moneyOpen} onClose={() => setMoneyOpen(false)} />
      <EmployersModal open={employersOpen} onClose={() => setEmployersOpen(false)} />
    </Container>
  );
}
