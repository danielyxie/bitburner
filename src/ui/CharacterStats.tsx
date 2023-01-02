import { Paper, Table, TableBody, Box, IconButton, Typography, Container, Tooltip } from "@mui/material";
import { MoreHoriz, Info } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { BitNodes, defaultMultipliers, getBitNodeMultipliers } from "../BitNode/BitNode";
import { BitNodeMultipliers } from "../BitNode/BitNodeMultipliers";
import { BitNodeMultipliersDisplay } from "../BitNode/ui/BitnodeMultipliersDescription";
import { HacknetServerConstants } from "../Hacknet/data/Constants";
import { getPurchaseServerLimit } from "../Server/ServerPurchases";
import { Settings } from "../Settings/Settings";
import { MoneySourceTracker } from "../utils/MoneySourceTracker";
import { convertTimeMsToTimeElapsedString } from "../utils/StringHelperFunctions";
import { Player } from "@player";
import { numeralWrapper } from "./numeralFormat";
import { Modal } from "./React/Modal";
import { Money } from "./React/Money";
import { StatsRow } from "./React/StatsRow";
import { StatsTable } from "./React/StatsTable";
import { isEqual } from "lodash";

interface EmployersModalProps {
  open: boolean;
  onClose: () => void;
}

const EmployersModal = ({ open, onClose }: EmployersModalProps): React.ReactElement => {
  return (
    <Modal open={open} onClose={onClose}>
      <>
        <Typography variant="h5">All Employers</Typography>
        <ul>
          {Object.keys(Player.jobs).map((j) => (
            <Typography key={j}>* {j}</Typography>
          ))}
        </ul>
      </>
    </Modal>
  );
};

interface IMultRow {
  // The name of the multiplier
  mult: string;

  // The player's raw multiplier value
  value: number;

  // The player's effective multiplier value, affected by BitNode mults
  effValue?: number;

  // The text color for the row
  color?: string;
}

interface MultTableProps {
  rows: IMultRow[];
  color: string;
  noMargin?: boolean;
}

function MultiplierTable(props: MultTableProps): React.ReactElement {
  return (
    <Table sx={{ display: "table", width: "100%", mb: (props.noMargin ?? false) === true ? 0 : 2 }}>
      <TableBody>
        {props.rows.map((data) => {
          const { mult, value, effValue = null, color = props.color } = data;

          if (effValue !== null && effValue !== value && Player.sourceFileLvl(5) > 0) {
            return (
              <StatsRow key={mult} name={mult} color={color} data={{}}>
                <>
                  <Typography color={color}>
                    <span style={{ opacity: 0.5 }}>{numeralWrapper.formatPercentage(value)}</span>{" "}
                    {numeralWrapper.formatPercentage(effValue)}
                  </Typography>
                </>
              </StatsRow>
            );
          }
          return (
            <StatsRow key={mult} name={mult} color={color} data={{ content: numeralWrapper.formatPercentage(value) }} />
          );
        })}
      </TableBody>
    </Table>
  );
}

function CurrentBitNode(): React.ReactElement {
  if (Player.sourceFiles.length > 0) {
    const index = "BitNode" + Player.bitNodeN;
    const lvl = Math.min(Player.sourceFileLvl(Player.bitNodeN) + 1, Player.bitNodeN === 12 ? Infinity : 3);
    return (
      <Paper sx={{ mb: 1, p: 1 }}>
        <Typography variant="h5">
          BitNode {Player.bitNodeN}: {BitNodes[index].name} (Level {lvl})
        </Typography>
        <Typography sx={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}>{BitNodes[index].info}</Typography>
      </Paper>
    );
  }

  return <></>;
}

interface IMoneyModalProps {
  open: boolean;
  onClose: () => void;
}

function MoneyModal({ open, onClose }: IMoneyModalProps): React.ReactElement {
  function convertMoneySourceTrackerToString(src: MoneySourceTracker): React.ReactElement {
    const parts: [string, JSX.Element][] = [[`Total:`, <Money money={src.total} />]];
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
      {convertMoneySourceTrackerToString(Player.moneySourceA)}
    </>
  );
  if (Player.sourceFiles.length !== 0) {
    content = (
      <>
        {content}
        <br />
        <br />
        <Typography variant="h6" color="primary">
          Money earned in this BitNode
        </Typography>
        <br />
        {convertMoneySourceTrackerToString(Player.moneySourceB)}
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
    ["Since last Augmentation installation", convertTimeMsToTimeElapsedString(Player.playtimeSinceLastAug)],
  ];
  if (Player.sourceFiles.length > 0) {
    timeRows.push(["Since last Bitnode destroyed", convertTimeMsToTimeElapsedString(Player.playtimeSinceLastBitnode)]);
  }
  timeRows.push(["Total", convertTimeMsToTimeElapsedString(Player.totalPlaytime)]);

  let showBitNodeMults = false;
  if (Player.sourceFileLvl(5) > 0) {
    const n = Player.bitNodeN;
    const maxSfLevel = n === 12 ? Infinity : 3;
    const mults = getBitNodeMultipliers(n, Math.min(Player.sourceFileLvl(n) + 1, maxSfLevel));
    showBitNodeMults = !isEqual(mults, defaultMultipliers);
  }
  return (
    <Container maxWidth="lg" disableGutters sx={{ mx: 0 }}>
      <Typography variant="h4">Stats</Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", minWidth: "fit-content", mb: 1, gap: 1 }}>
        <Paper sx={{ p: 1 }}>
          <Typography variant="h5">General</Typography>
          <Table>
            <TableBody>
              <StatsRow name="Current City" color={Settings.theme.primary} data={{ content: Player.city }} />
              <StatsRow name="Money" color={Settings.theme.money} data={{}}>
                <>
                  <Money money={Player.money} />
                  <IconButton onClick={() => setMoneyOpen(true)} sx={{ p: 0 }}>
                    <MoreHoriz color="info" />
                  </IconButton>
                </>
              </StatsRow>

              {Player.jobs && Object.keys(Player.jobs).length !== 0 ? (
                <StatsRow name="All Employers" color={Settings.theme.primary} data={{}}>
                  <>
                    <span style={{ color: Settings.theme.primary }}>{Object.keys(Player.jobs).length} total</span>
                    <IconButton onClick={() => setEmployersOpen(true)} sx={{ p: 0 }}>
                      <MoreHoriz color="info" />
                    </IconButton>
                  </>
                </StatsRow>
              ) : (
                <></>
              )}
              <StatsRow
                name="Servers Owned"
                color={Settings.theme.primary}
                data={{ content: `${Player.purchasedServers.length} / ${getPurchaseServerLimit()}` }}
              />
              <StatsRow
                name={`Hacknet ${Player.bitNodeN === 9 || Player.sourceFileLvl(9) > 0 ? "Servers" : "Nodes"} owned`}
                color={Settings.theme.primary}
                data={{
                  content: `${Player.hacknetNodes.length}${
                    Player.bitNodeN === 9 || Player.sourceFileLvl(9) > 0
                      ? ` / ${HacknetServerConstants.MaxServers}`
                      : ""
                  }`,
                }}
              />
              <StatsRow
                name="Augmentations Installed"
                color={Settings.theme.primary}
                data={{ content: String(Player.augmentations.length) }}
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
                data={{ level: Player.skills.hacking, exp: Player.exp.hacking }}
              />
              <StatsRow
                name="Strength"
                color={Settings.theme.combat}
                data={{ level: Player.skills.strength, exp: Player.exp.strength }}
              />
              <StatsRow
                name="Defense"
                color={Settings.theme.combat}
                data={{ level: Player.skills.defense, exp: Player.exp.defense }}
              />
              <StatsRow
                name="Dexterity"
                color={Settings.theme.combat}
                data={{ level: Player.skills.dexterity, exp: Player.exp.dexterity }}
              />
              <StatsRow
                name="Agility"
                color={Settings.theme.combat}
                data={{ level: Player.skills.agility, exp: Player.exp.agility }}
              />
              <StatsRow
                name="Charisma"
                color={Settings.theme.cha}
                data={{ level: Player.skills.charisma, exp: Player.exp.charisma }}
              />
              {Player.skills.intelligence > 0 && (Player.bitNodeN === 5 || Player.sourceFileLvl(5) > 0) && (
                <StatsRow
                  name="Intelligence"
                  color={Settings.theme.int}
                  data={{ level: Player.skills.intelligence, exp: Player.exp.intelligence }}
                />
              )}
            </TableBody>
          </Table>
        </Paper>
      </Box>

      <Paper sx={{ p: 1, mb: 1 }}>
        <Typography variant="h5" color="primary" sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
          Multipliers
          {Player.sourceFileLvl(5) > 0 && (
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
                  The dim number is the raw multiplier, and the undimmed number is the effective multiplier, as dictated
                  by the BitNode.
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
                {
                  mult: "Hacking Chance",
                  value: Player.mults.hacking_chance,
                },
                {
                  mult: "Hacking Speed",
                  value: Player.mults.hacking_speed,
                },
                {
                  mult: "Hacking Money",
                  value: Player.mults.hacking_money,
                  effValue: Player.mults.hacking_money * BitNodeMultipliers.ScriptHackMoney,
                },
                {
                  mult: "Hacking Growth",
                  value: Player.mults.hacking_grow,
                  effValue: Player.mults.hacking_grow * BitNodeMultipliers.ServerGrowthRate,
                },
              ]}
              color={Settings.theme.hack}
            />
            <MultiplierTable
              rows={[
                {
                  mult: "Hacking Level",
                  value: Player.mults.hacking,
                  effValue: Player.mults.hacking * BitNodeMultipliers.HackingLevelMultiplier,
                },
                {
                  mult: "Hacking Experience",
                  value: Player.mults.hacking_exp,
                  effValue: Player.mults.hacking_exp * BitNodeMultipliers.HackExpGain,
                },
              ]}
              color={Settings.theme.hack}
            />
            <MultiplierTable
              rows={[
                {
                  mult: "Strength Level",
                  value: Player.mults.strength,
                  effValue: Player.mults.strength * BitNodeMultipliers.StrengthLevelMultiplier,
                },
                {
                  mult: "Strength Experience",
                  value: Player.mults.strength_exp,
                },
              ]}
              color={Settings.theme.combat}
            />
            <MultiplierTable
              rows={[
                {
                  mult: "Defense Level",
                  value: Player.mults.defense,
                  effValue: Player.mults.defense * BitNodeMultipliers.DefenseLevelMultiplier,
                },
                {
                  mult: "Defense Experience",
                  value: Player.mults.defense_exp,
                },
              ]}
              color={Settings.theme.combat}
            />
            <MultiplierTable
              rows={[
                {
                  mult: "Dexterity Level",
                  value: Player.mults.dexterity,
                  effValue: Player.mults.dexterity * BitNodeMultipliers.DexterityLevelMultiplier,
                },
                {
                  mult: "Dexterity Experience",
                  value: Player.mults.dexterity_exp,
                },
              ]}
              color={Settings.theme.combat}
            />
            <MultiplierTable
              rows={[
                {
                  mult: "Agility Level",
                  value: Player.mults.agility,
                  effValue: Player.mults.agility * BitNodeMultipliers.AgilityLevelMultiplier,
                },
                {
                  mult: "Agility Experience",
                  value: Player.mults.agility_exp,
                },
              ]}
              color={Settings.theme.combat}
            />
            <MultiplierTable
              rows={[
                {
                  mult: "Charisma Level",
                  value: Player.mults.charisma,
                  effValue: Player.mults.charisma * BitNodeMultipliers.CharismaLevelMultiplier,
                },
                {
                  mult: "Charisma Experience",
                  value: Player.mults.charisma_exp,
                },
              ]}
              color={Settings.theme.cha}
              noMargin
            />
          </Box>

          <Box>
            <MultiplierTable
              rows={[
                {
                  mult: "Hacknet Node Production",
                  value: Player.mults.hacknet_node_money,
                  effValue: Player.mults.hacknet_node_money * BitNodeMultipliers.HacknetNodeMoney,
                },
                {
                  mult: "Hacknet Node Purchase Cost",
                  value: Player.mults.hacknet_node_purchase_cost,
                },
                {
                  mult: "Hacknet Node RAM Upgrade Cost",
                  value: Player.mults.hacknet_node_ram_cost,
                },
                {
                  mult: "Hacknet Node Core Purchase Cost",
                  value: Player.mults.hacknet_node_core_cost,
                },
                {
                  mult: "Hacknet Node Level Upgrade Cost",
                  value: Player.mults.hacknet_node_level_cost,
                },
              ]}
              color={Settings.theme.primary}
            />
            <MultiplierTable
              rows={[
                {
                  mult: "Company Reputation Gain",
                  value: Player.mults.company_rep,
                  color: Settings.theme.rep,
                },
                {
                  mult: "Faction Reputation Gain",
                  value: Player.mults.faction_rep,
                  effValue: Player.mults.faction_rep * BitNodeMultipliers.FactionWorkRepGain,
                  color: Settings.theme.rep,
                },
                {
                  mult: "Salary",
                  value: Player.mults.work_money,
                  effValue: Player.mults.work_money * BitNodeMultipliers.CompanyWorkMoney,
                  color: Settings.theme.money,
                },
              ]}
              color={Settings.theme.money}
            />
            <MultiplierTable
              rows={[
                {
                  mult: "Crime Success Chance",
                  value: Player.mults.crime_success,
                },
                {
                  mult: "Crime Money",
                  value: Player.mults.crime_money,
                  effValue: Player.mults.crime_money * BitNodeMultipliers.CrimeMoney,
                  color: Settings.theme.money,
                },
              ]}
              color={Settings.theme.combat}
            />
            {Player.canAccessBladeburner() && BitNodeMultipliers.BladeburnerRank > 0 && (
              <MultiplierTable
                rows={[
                  {
                    mult: "Bladeburner Success Chance",
                    value: Player.mults.bladeburner_success_chance,
                  },
                  {
                    mult: "Bladeburner Max Stamina",
                    value: Player.mults.bladeburner_max_stamina,
                  },
                  {
                    mult: "Bladeburner Stamina Gain",
                    value: Player.mults.bladeburner_stamina_gain,
                  },
                  {
                    mult: "Bladeburner Field Analysis",
                    value: Player.mults.bladeburner_analysis,
                  },
                ]}
                color={Settings.theme.primary}
                noMargin
              />
            )}
          </Box>
        </Box>
      </Paper>

      <Paper sx={{ p: 1, mb: 1 }}>
        <Typography variant="h5">Time Played</Typography>
        <Table>
          <TableBody>
            {timeRows.map(([name, content]) => (
              <StatsRow key={name} name={name} color={Settings.theme.primary} data={{ content: content }} />
            ))}
          </TableBody>
        </Table>
      </Paper>

      <CurrentBitNode />

      {showBitNodeMults && (
        <Paper sx={{ p: 1, mb: 1 }}>
          <Typography variant="h5">BitNode Multipliers</Typography>
          <BitNodeMultipliersDisplay n={Player.bitNodeN} />
        </Paper>
      )}

      <MoneyModal open={moneyOpen} onClose={() => setMoneyOpen(false)} />
      <EmployersModal open={employersOpen} onClose={() => setEmployersOpen(false)} />
    </Container>
  );
}
