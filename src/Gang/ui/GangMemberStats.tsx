/**
 * React Component for the first part of a gang member details.
 * Contains skills and exp.
 */
import React, { useState } from "react";
import { formatNumber } from "../../utils/StringHelperFunctions";
import { numeralWrapper } from "../../ui/numeralFormat";
import { GangMember } from "../GangMember";
import { AscensionModal } from "./AscensionModal";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import { StaticModal } from "../../ui/React/StaticModal";
import IconButton from "@mui/material/IconButton";
import HelpIcon from "@mui/icons-material/Help";

interface IProps {
  member: GangMember;
  onAscend: () => void;
}

export function GangMemberStats(props: IProps): React.ReactElement {
  const [helpOpen, setHelpOpen] = useState(false);
  const [ascendOpen, setAscendOpen] = useState(false);

  const asc = {
    hack: props.member.calculateAscensionMult(props.member.hack_asc_points),
    str: props.member.calculateAscensionMult(props.member.str_asc_points),
    def: props.member.calculateAscensionMult(props.member.def_asc_points),
    dex: props.member.calculateAscensionMult(props.member.dex_asc_points),
    agi: props.member.calculateAscensionMult(props.member.agi_asc_points),
    cha: props.member.calculateAscensionMult(props.member.cha_asc_points),
  };

  return (
    <>
      <Tooltip
        title={
          <Typography>
            Hk: x{numeralWrapper.formatMultiplier(props.member.hack_mult * asc.hack)}(x
            {numeralWrapper.formatMultiplier(props.member.hack_mult)} Eq, x{numeralWrapper.formatMultiplier(asc.hack)}{" "}
            Asc)
            <br />
            St: x{numeralWrapper.formatMultiplier(props.member.str_mult * asc.str)}
            (x{numeralWrapper.formatMultiplier(props.member.str_mult)} Eq, x{numeralWrapper.formatMultiplier(asc.str)}{" "}
            Asc)
            <br />
            Df: x{numeralWrapper.formatMultiplier(props.member.def_mult * asc.def)}
            (x{numeralWrapper.formatMultiplier(props.member.def_mult)} Eq, x{numeralWrapper.formatMultiplier(asc.def)}{" "}
            Asc)
            <br />
            Dx: x{numeralWrapper.formatMultiplier(props.member.dex_mult * asc.dex)}
            (x{numeralWrapper.formatMultiplier(props.member.dex_mult)} Eq, x{numeralWrapper.formatMultiplier(asc.dex)}{" "}
            Asc)
            <br />
            Ag: x{numeralWrapper.formatMultiplier(props.member.agi_mult * asc.agi)}
            (x{numeralWrapper.formatMultiplier(props.member.agi_mult)} Eq, x{numeralWrapper.formatMultiplier(asc.agi)}{" "}
            Asc)
            <br />
            Ch: x{numeralWrapper.formatMultiplier(props.member.cha_mult * asc.cha)}
            (x{numeralWrapper.formatMultiplier(props.member.cha_mult)} Eq, x{numeralWrapper.formatMultiplier(asc.cha)}{" "}
            Asc)
          </Typography>
        }
      >
        <Typography>
          Hacking: {formatNumber(props.member.hack, 0)} ({numeralWrapper.formatExp(props.member.hack_exp)} exp)
          <br />
          Strength: {formatNumber(props.member.str, 0)} ({numeralWrapper.formatExp(props.member.str_exp)} exp)
          <br />
          Defense: {formatNumber(props.member.def, 0)} ({numeralWrapper.formatExp(props.member.def_exp)} exp)
          <br />
          Dexterity: {formatNumber(props.member.dex, 0)} ({numeralWrapper.formatExp(props.member.dex_exp)} exp)
          <br />
          Agility: {formatNumber(props.member.agi, 0)} ({numeralWrapper.formatExp(props.member.agi_exp)} exp)
          <br />
          Charisma: {formatNumber(props.member.cha, 0)} ({numeralWrapper.formatExp(props.member.cha_exp)} exp)
          <br />
        </Typography>
      </Tooltip>
      <br />
      {props.member.canAscend() && (
        <>
          <Button onClick={() => setAscendOpen(true)}>Ascend</Button>
          <AscensionModal
            open={ascendOpen}
            onClose={() => setAscendOpen(false)}
            member={props.member}
            onAscend={props.onAscend}
          />
          <IconButton onClick={() => setHelpOpen(true)}>
            <HelpIcon />
          </IconButton>
          <StaticModal open={helpOpen} onClose={() => setHelpOpen(false)}>
            <Typography>
              Ascending a Gang Member resets the member's progress and stats in exchange for a permanent boost to their
              stat multipliers.
              <br />
              <br />
              The additional stat multiplier that the Gang Member gains upon ascension is based on the amount of exp
              they have.
              <br />
              <br />
              Upon ascension, the member will lose all of its non-Augmentation Equipment and your gang will lose respect
              equal to the total respect earned by the member.
            </Typography>
          </StaticModal>
        </>
      )}
    </>
  );
}
