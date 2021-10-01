/**
 * React Component for the popup that manages gang members upgrades
 */
import React, { useState } from "react";
import { formatNumber } from "../../utils/StringHelperFunctions";
import { numeralWrapper } from "../../ui/numeralFormat";
import { GangMemberUpgrades } from "../GangMemberUpgrades";
import { GangMemberUpgrade } from "../GangMemberUpgrade";
import { Money } from "../../ui/React/Money";
import { useGang } from "./Context";
import { GangMember } from "../GangMember";
import { UpgradeType } from "../data/upgrades";
import { use } from "../../ui/Context";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

interface INextRevealProps {
  upgrades: string[];
  type: UpgradeType;
}

function NextReveal(props: INextRevealProps): React.ReactElement {
  const gang = useGang();
  const player = use.Player();
  const upgrades = Object.keys(GangMemberUpgrades)
    .filter((upgName: string) => {
      const upg = GangMemberUpgrades[upgName];
      if (player.money.gt(gang.getUpgradeCost(upg))) return false;
      if (upg.type !== props.type) return false;
      if (props.upgrades.includes(upgName)) return false;
      return true;
    })
    .map((upgName: string) => GangMemberUpgrades[upgName]);

  if (upgrades.length === 0) return <></>;
  return (
    <Typography>
      Next at <Money money={upgrades[0].cost} />
    </Typography>
  );
}

function PurchasedUpgrade({ upgName }: { upgName: string }): React.ReactElement {
  const upg = GangMemberUpgrades[upgName];
  return (
    <Paper sx={{ mx: 1, p: 1 }}>
      <Box display="flex">
        <Tooltip title={<Typography dangerouslySetInnerHTML={{ __html: upg.desc }} />}>
          <Typography>{upg.name}</Typography>
        </Tooltip>
      </Box>
    </Paper>
  );
}

interface IUpgradeButtonProps {
  upg: GangMemberUpgrade;
  rerender: () => void;
  member: GangMember;
}

function UpgradeButton(props: IUpgradeButtonProps): React.ReactElement {
  const gang = useGang();
  const player = use.Player();
  function onClick(): void {
    props.member.buyUpgrade(props.upg, player, gang);
    props.rerender();
  }
  return (
    <Tooltip title={<Typography dangerouslySetInnerHTML={{ __html: props.upg.desc }} />}>
      <span>
        <Typography>{props.upg.name}</Typography>
        <Button onClick={onClick}>
          <Money money={gang.getUpgradeCost(props.upg)} />
        </Button>
      </span>
    </Tooltip>
  );
}

interface IPanelProps {
  member: GangMember;
}

function GangMemberUpgradePanel(props: IPanelProps): React.ReactElement {
  const gang = useGang();
  const player = use.Player();
  const setRerender = useState(false)[1];
  function rerender(): void {
    setRerender((old) => !old);
  }
  function filterUpgrades(list: string[], type: UpgradeType): GangMemberUpgrade[] {
    return Object.keys(GangMemberUpgrades)
      .filter((upgName: string) => {
        const upg = GangMemberUpgrades[upgName];
        if (player.money.lt(gang.getUpgradeCost(upg))) return false;
        if (upg.type !== type) return false;
        if (list.includes(upgName)) return false;
        return true;
      })
      .map((upgName: string) => GangMemberUpgrades[upgName]);
  }
  const weaponUpgrades = filterUpgrades(props.member.upgrades, UpgradeType.Weapon);
  const armorUpgrades = filterUpgrades(props.member.upgrades, UpgradeType.Armor);
  const vehicleUpgrades = filterUpgrades(props.member.upgrades, UpgradeType.Vehicle);
  const rootkitUpgrades = filterUpgrades(props.member.upgrades, UpgradeType.Rootkit);
  const augUpgrades = filterUpgrades(props.member.augmentations, UpgradeType.Augmentation);

  const asc = {
    hack: props.member.calculateAscensionMult(props.member.hack_asc_points),
    str: props.member.calculateAscensionMult(props.member.str_asc_points),
    def: props.member.calculateAscensionMult(props.member.def_asc_points),
    dex: props.member.calculateAscensionMult(props.member.dex_asc_points),
    agi: props.member.calculateAscensionMult(props.member.agi_asc_points),
    cha: props.member.calculateAscensionMult(props.member.cha_asc_points),
  };
  return (
    <Paper>
      <Typography variant="h5" color="primary">
        {props.member.name} ({props.member.task})
      </Typography>
      <Typography>
        Hack: {props.member.hack} (x
        {formatNumber(props.member.hack_mult * asc.hack, 2)})<br />
        Str: {props.member.str} (x
        {formatNumber(props.member.str_mult * asc.str, 2)})<br />
        Def: {props.member.def} (x
        {formatNumber(props.member.def_mult * asc.def, 2)})<br />
        Dex: {props.member.dex} (x
        {formatNumber(props.member.dex_mult * asc.dex, 2)})<br />
        Agi: {props.member.agi} (x
        {formatNumber(props.member.agi_mult * asc.agi, 2)})<br />
        Cha: {props.member.cha} (x
        {formatNumber(props.member.cha_mult * asc.cha, 2)})
      </Typography>
      <Box display="flex" flexWrap="wrap">
        <Typography>Purchased Upgrades: </Typography>
        <br />
        {props.member.upgrades.map((upg: string) => (
          <PurchasedUpgrade key={upg} upgName={upg} />
        ))}
        {props.member.augmentations.map((upg: string) => (
          <PurchasedUpgrade key={upg} upgName={upg} />
        ))}
      </Box>
      <Box display="flex" justifyContent="space-around">
        <Box>
          <Typography variant="h6" color="primary">
            Weapons
          </Typography>
          {weaponUpgrades.map((upg) => (
            <UpgradeButton key={upg.name} rerender={rerender} member={props.member} upg={upg} />
          ))}
          <NextReveal type={UpgradeType.Weapon} upgrades={props.member.upgrades} />
        </Box>
        <Box>
          <Typography variant="h6" color="primary">
            Armor
          </Typography>
          {armorUpgrades.map((upg) => (
            <UpgradeButton key={upg.name} rerender={rerender} member={props.member} upg={upg} />
          ))}
          <NextReveal type={UpgradeType.Armor} upgrades={props.member.upgrades} />
        </Box>
        <Box>
          <Typography variant="h6" color="primary">
            Vehicles
          </Typography>
          {vehicleUpgrades.map((upg) => (
            <UpgradeButton key={upg.name} rerender={rerender} member={props.member} upg={upg} />
          ))}
          <NextReveal type={UpgradeType.Vehicle} upgrades={props.member.upgrades} />
        </Box>
        <Box>
          <Typography variant="h6" color="primary">
            Rootkits
          </Typography>
          {rootkitUpgrades.map((upg) => (
            <UpgradeButton key={upg.name} rerender={rerender} member={props.member} upg={upg} />
          ))}
          <NextReveal type={UpgradeType.Rootkit} upgrades={props.member.upgrades} />
        </Box>
        <Box>
          <Typography variant="h6" color="primary">
            Augmentations
          </Typography>
          {augUpgrades.map((upg) => (
            <UpgradeButton key={upg.name} rerender={rerender} member={props.member} upg={upg} />
          ))}
          <NextReveal type={UpgradeType.Augmentation} upgrades={props.member.upgrades} />
        </Box>
      </Box>
    </Paper>
  );
}

export function EquipmentsSubpage(): React.ReactElement {
  const gang = useGang();
  return (
    <>
      <Tooltip
        title={
          <Typography>
            You get a discount on equipment and upgrades based on your gang's respect and power. More respect and power
            leads to more discounts.
          </Typography>
        }
      >
        <Typography>Discount: -{numeralWrapper.formatPercentage(1 - 1 / gang.getDiscount())}</Typography>
      </Tooltip>
      {gang.members.map((member: GangMember) => (
        <GangMemberUpgradePanel key={member.name} member={member} />
      ))}
    </>
  );
}
