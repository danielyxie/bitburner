import React, { useState } from "react";
import { Modal } from "../../ui/React/Modal";
import { IndustryResearchTrees } from "../IndustryData";
import { CorporationConstants } from "../data/Constants";
import { IIndustry } from "../IIndustry";
import { Research } from "../Actions";
import { Node } from "../ResearchTree";
import { ResearchMap } from "../ResearchMap";
import { dialogBoxCreate } from "../../ui/React/DialogBox";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ExpandLess from "@mui/icons-material/ExpandLess";
interface INodeProps {
  n: Node | null;
  division: IIndustry;
}
function Upgrade({ n, division }: INodeProps): React.ReactElement {
  const [open, setOpen] = useState(false);
  if (n === null) return <></>;
  const r = ResearchMap[n.text];
  let disabled = division.sciResearch.qty < r.cost || n.researched;
  const parent = n.parent;
  if (parent !== null) {
    disabled = disabled || !parent.researched;
  }

  function research(): void {
    if (n === null || disabled) return;
    try {
      Research(division, n.text);
    } catch (err) {
      dialogBoxCreate(err + "");
      return;
    }

    dialogBoxCreate(
      `Researched ${n.text}. It may take a market cycle ` +
        `(~${CorporationConstants.SecsPerMarketCycle} seconds) before the effects of ` +
        `the Research apply.`,
    );
  }

  const but = (
    <Box>
      <Tooltip
        title={
          <Typography>
            Research points: {r.cost}
            <br />
            {r.desc}
          </Typography>
        }
      >
        <span>
          <Button disabled={disabled} onClick={research}>
            {n.text}
          </Button>
        </span>
      </Tooltip>
    </Box>
  );

  if (n.children.length === 0) return but;

  return (
    <Box>
      <Box display="flex">
        {but}
        <ListItemButton onClick={() => setOpen((old) => !old)}>
          <ListItemText />
          {open ? <ExpandLess color="primary" /> : <ExpandMore color="primary" />}
        </ListItemButton>
      </Box>
      <Collapse in={open} unmountOnExit>
        <Box m={4}>
          {n.children.map((m) => (
            <Upgrade key={m.text} division={division} n={m} />
          ))}
        </Box>
      </Collapse>
    </Box>
  );
}

interface IProps {
  open: boolean;
  onClose: () => void;
  industry: IIndustry;
}

// Create the Research Tree UI for this Industry
export function ResearchModal(props: IProps): React.ReactElement {
  const researchTree = IndustryResearchTrees[props.industry.type];
  if (researchTree === undefined) return <></>;

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Upgrade division={props.industry} n={researchTree.root} />
      <Typography>
        Research points: {props.industry.sciResearch.qty.toFixed(3)}
        <br />
        Multipliers from research:
        <br />* Advertising Multiplier: x{researchTree.getAdvertisingMultiplier()}
        <br />* Employee Charisma Multiplier: x{researchTree.getEmployeeChaMultiplier()}
        <br />* Employee Creativity Multiplier: x{researchTree.getEmployeeCreMultiplier()}
        <br />* Employee Efficiency Multiplier: x{researchTree.getEmployeeEffMultiplier()}
        <br />* Employee Intelligence Multiplier: x{researchTree.getEmployeeIntMultiplier()}
        <br />* Production Multiplier: x{researchTree.getProductionMultiplier()}
        <br />* Sales Multiplier: x{researchTree.getSalesMultiplier()}
        <br />* Scientific Research Multiplier: x{researchTree.getScientificResearchMultiplier()}
        <br />* Storage Multiplier: x{researchTree.getStorageMultiplier()}
      </Typography>
    </Modal>
  );
}
