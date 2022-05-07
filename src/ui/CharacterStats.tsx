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
import { use } from "./Context";
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
  const player = use.Player();
  return (
    <Table sx={{ display: "table", width: "100%", mb: (props.noMargin ?? false) === true ? 0 : 2 }}>
      <TableBody>
        {props.rows.map((data) => {
          const { mult, value, effValue = null, color = props.color } = data;

          if (effValue && effValue !== value && player.sourceFileLvl(5) > 0) {
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
  const player = use.Player();
  if (player.sourceFiles.length > 0) {
    const index = "BitNode" + player.bitNodeN;
    const lvl = Math.min(player.sourceFileLvl(player.bitNodeN) + 1, player.bitNodeN === 12 ? Infinity : 3);
    return (
      <Paper sx={{ mb: 1, p: 1 }}>
        <Typography variant="h5">
          BitNode {player.bitNodeN}: {BitNodes[index].name} (Level {lvl})
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

  let showBitNodeMults = false;
  if (player.sourceFileLvl(5) > 0) {
    const n = player.bitNodeN;
    const maxSfLevel = n === 12 ? Infinity : 3;
    const mults = getBitNodeMultipliers(n, Math.min(player.sourceFileLvl(n) + 1, maxSfLevel));
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
              <StatsRow name="Current City" color={Settings.theme.primary} data={{ content: player.city }} />
              <StatsRow name="Money" color={Settings.theme.money} data={{}}>
                <>
                  <Money money={player.money} />
                  <IconButton onClick={() => setMoneyOpen(true)} sx={{ p: 0 }}>
                    <MoreHoriz color="info" />
                  </IconButton>
                </>
              </StatsRow>
              {player.companyName ? (
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
              ) : (
                <></>
              )}
              {player.jobs && Object.keys(player.jobs).length !== 0 ? (
                <StatsRow name="All Employers" color={Settings.theme.primary} data={{}}>
                  <>
                    <span style={{ color: Settings.theme.primary }}>{Object.keys(player.jobs).length} total</span>
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
                data={{ content: `${player.purchasedServers.length} / ${getPurchaseServerLimit()}` }}
              />
              <StatsRow
                name={`Hacknet ${player.bitNodeN === 9 || player.sourceFileLvl(9) > 0 ? "Servers" : "Nodes"} owned`}
                color={Settings.theme.primary}
                data={{
                  content: `${player.hacknetNodes.length}${
                    player.bitNodeN === 9 || player.sourceFileLvl(9) > 0
                      ? ` / ${HacknetServerConstants.MaxServers}`
                      : ""
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
              {player.intelligence > 0 && (player.bitNodeN === 5 || player.sourceFileLvl(5) > 0) && (
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

      <Paper sx={{ p: 1, mb: 1 }}>
        <Typography variant="h5" color="primary" sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
          Multipliers
          {player.sourceFileLvl(5) > 0 && (
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
                  value: player.hacking_chance_mult,
                },
                {
                  mult: "Hacking Speed",
                  value: player.hacking_speed_mult,
                },
                {
                  mult: "Hacking Money",
                  value: player.hacking_money_mult,
                  effValue: player.hacking_money_mult * BitNodeMultipliers.ScriptHackMoney,
                },
                {
                  mult: "Hacking Growth",
                  value: player.hacking_grow_mult,
                  effValue: player.hacking_grow_mult * BitNodeMultipliers.ServerGrowthRate,
                },
              ]}
              color={Settings.theme.hack}
            />
            <MultiplierTable
              rows={[
                {
                  mult: "Hacking Level",
                  value: player.hacking_mult,
                  effValue: player.hacking_mult * BitNodeMultipliers.HackingLevelMultiplier,
                },
                {
                  mult: "Hacking Experience",
                  value: player.hacking_exp_mult,
                  effValue: player.hacking_exp_mult * BitNodeMultipliers.HackExpGain,
                },
              ]}
              color={Settings.theme.hack}
            />
            <MultiplierTable
              rows={[
                {
                  mult: "Strength Level",
                  value: player.strength_mult,
                  effValue: player.strength_mult * BitNodeMultipliers.StrengthLevelMultiplier,
                },
                {
                  mult: "Strength Experience",
                  value: player.strength_exp_mult,
                },
              ]}
              color={Settings.theme.combat}
            />
            <MultiplierTable
              rows={[
                {
                  mult: "Defense Level",
                  value: player.defense_mult,
                  effValue: player.defense_mult * BitNodeMultipliers.DefenseLevelMultiplier,
                },
                {
                  mult: "Defense Experience",
                  value: player.defense_exp_mult,
                },
              ]}
              color={Settings.theme.combat}
            />
            <MultiplierTable
              rows={[
                {
                  mult: "Dexterity Level",
                  value: player.dexterity_mult,
                  effValue: player.dexterity_mult * BitNodeMultipliers.DexterityLevelMultiplier,
                },
                {
                  mult: "Dexterity Experience",
                  value: player.dexterity_exp_mult,
                },
              ]}
              color={Settings.theme.combat}
            />
            <MultiplierTable
              rows={[
                {
                  mult: "Agility Level",
                  value: player.agility_mult,
                  effValue: player.agility_mult * BitNodeMultipliers.AgilityLevelMultiplier,
                },
                {
                  mult: "Agility Experience",
                  value: player.agility_exp_mult,
                },
              ]}
              color={Settings.theme.combat}
            />
            <MultiplierTable
              rows={[
                {
                  mult: "Charisma Level",
                  value: player.charisma_mult,
                  effValue: player.charisma_mult * BitNodeMultipliers.CharismaLevelMultiplier,
                },
                {
                  mult: "Charisma Experience",
                  value: player.charisma_exp_mult,
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
                  value: player.hacknet_node_money_mult,
                  effValue: player.hacknet_node_money_mult * BitNodeMultipliers.HacknetNodeMoney,
                },
                {
                  mult: "Hacknet Node Purchase Cost",
                  value: player.hacknet_node_purchase_cost_mult,
                },
                {
                  mult: "Hacknet Node RAM Upgrade Cost",
                  value: player.hacknet_node_ram_cost_mult,
                },
                {
                  mult: "Hacknet Node Core Purchase Cost",
                  value: player.hacknet_node_core_cost_mult,
                },
                {
                  mult: "Hacknet Node Level Upgrade Cost",
                  value: player.hacknet_node_level_cost_mult,
                },
              ]}
              color={Settings.theme.primary}
            />
            <MultiplierTable
              rows={[
                {
                  mult: "Company Reputation Gain",
                  value: player.company_rep_mult,
                  color: Settings.theme.rep,
                },
                {
                  mult: "Faction Reputation Gain",
                  value: player.faction_rep_mult,
                  effValue: player.faction_rep_mult * BitNodeMultipliers.FactionWorkRepGain,
                  color: Settings.theme.rep,
                },
                {
                  mult: "Salary",
                  value: player.work_money_mult,
                  effValue: player.work_money_mult * BitNodeMultipliers.CompanyWorkMoney,
                  color: Settings.theme.money,
                },
              ]}
              color={Settings.theme.money}
            />
            <MultiplierTable
              rows={[
                {
                  mult: "Crime Success Chance",
                  value: player.crime_success_mult,
                },
                {
                  mult: "Crime Money",
                  value: player.crime_money_mult,
                  effValue: player.crime_money_mult * BitNodeMultipliers.CrimeMoney,
                  color: Settings.theme.money,
                },
              ]}
              color={Settings.theme.combat}
            />
            {player.canAccessBladeburner() && (
              <MultiplierTable
                rows={[
                  {
                    mult: "Bladeburner Success Chance",
                    value: player.bladeburner_success_chance_mult,
                  },
                  {
                    mult: "Bladeburner Max Stamina",
                    value: player.bladeburner_max_stamina_mult,
                  },
                  {
                    mult: "Bladeburner Stamina Gain",
                    value: player.bladeburner_stamina_gain_mult,
                  },
                  {
                    mult: "Bladeburner Field Analysis",
                    value: player.bladeburner_analysis_mult,
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
          <BitNodeMultipliersDisplay n={player.bitNodeN} />
        </Paper>
      )}

      <MoneyModal open={moneyOpen} onClose={() => setMoneyOpen(false)} />
      <EmployersModal open={employersOpen} onClose={() => setEmployersOpen(false)} />
    </Container>
  );
}
