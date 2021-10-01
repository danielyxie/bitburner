/**
 * React Component for the content of the popup before the player confirms the
 * ascension of a gang member.
 */
import React, { useState, useEffect } from "react";
import { GangMember } from "../GangMember";
import { numeralWrapper } from "../../ui/numeralFormat";
import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { Modal } from "../../ui/React/Modal";
import { useGang } from "./Context";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

interface IProps {
  open: boolean;
  onClose: () => void;
  member: GangMember;
  onAscend: () => void;
}

export function AscensionModal(props: IProps): React.ReactElement {
  const gang = useGang();
  const setRerender = useState(false)[1];

  useEffect(() => {
    const id = setInterval(() => setRerender((old) => !old), 1000);
    return () => clearInterval(id);
  }, []);

  function confirm(): void {
    props.onAscend();
    const res = gang.ascendMember(props.member);
    dialogBoxCreate(
      <Typography>
        You ascended {props.member.name}!<br />
        <br />
        Your gang lost {numeralWrapper.formatRespect(res.respect)} respect.
        <br />
        <br />
        {props.member.name} gained the following stat multipliers for ascending:
        <br />
        Hacking: x{numeralWrapper.format(res.hack, "0.000")}
        <br />
        Strength: x{numeralWrapper.format(res.str, "0.000")}
        <br />
        Defense: x{numeralWrapper.format(res.def, "0.000")}
        <br />
        Dexterity: x{numeralWrapper.format(res.dex, "0.000")}
        <br />
        Agility: x{numeralWrapper.format(res.agi, "0.000")}
        <br />
        Charisma: x{numeralWrapper.format(res.cha, "0.000")}
        <br />
      </Typography>,
    );
    props.onClose();
  }

  // const ascendBenefits = props.member.getAscensionResults();
  const preAscend = props.member.getCurrentAscensionMults();
  const postAscend = props.member.getAscensionMultsAfterAscend();

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Typography>
        Are you sure you want to ascend this member? They will lose all of
        <br />
        their non-Augmentation upgrades and their stats will reset back to 1.
        <br />
        <br />
        Furthermore, your gang will lose {numeralWrapper.formatRespect(props.member.earnedRespect)} respect
        <br />
        <br />
        In return, they will gain the following permanent boost to stat multipliers:
        <br />
        Hacking: x{numeralWrapper.format(preAscend.hack, "0.000")} =&gt; x
        {numeralWrapper.format(postAscend.hack, "0.000")}
        <br />
        Strength: x{numeralWrapper.format(preAscend.str, "0.000")} =&gt; x
        {numeralWrapper.format(postAscend.str, "0.000")}
        <br />
        Defense: x{numeralWrapper.format(preAscend.def, "0.000")} =&gt; x
        {numeralWrapper.format(postAscend.def, "0.000")}
        <br />
        Dexterity: x{numeralWrapper.format(preAscend.dex, "0.000")} =&gt; x
        {numeralWrapper.format(postAscend.dex, "0.000")}
        <br />
        Agility: x{numeralWrapper.format(preAscend.agi, "0.000")} =&gt; x
        {numeralWrapper.format(postAscend.agi, "0.000")}
        <br />
        Charisma: x{numeralWrapper.format(preAscend.cha, "0.000")} =&gt; x
        {numeralWrapper.format(postAscend.cha, "0.000")}
        <br />
      </Typography>
      <Button onClick={confirm}>Ascend</Button>
    </Modal>
  );
}
