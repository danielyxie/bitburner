import React from "react";
import { numeralWrapper } from "../../ui/numeralFormat";
import { CorporationConstants } from "../data/Constants";
import { OfficeSpace } from "../OfficeSpace";
import { ICorporation } from "../ICorporation";
import { UpgradeOfficeSize } from "../Actions";
import { Modal } from "../../ui/React/Modal";
import { useCorporation } from "./Context";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";

interface IProps {
  open: boolean;
  onClose: () => void;
  office: OfficeSpace;
  rerender: () => void;
}

export function UpgradeOfficeSizeModal(props: IProps): React.ReactElement {
  const corp = useCorporation();
  const initialPriceMult = Math.round(props.office.size / CorporationConstants.OfficeInitialSize);
  const costMultiplier = 1.09;
  const upgradeCost = CorporationConstants.OfficeInitialCost * Math.pow(costMultiplier, initialPriceMult);

  // Calculate cost to upgrade size by 15 employees
  let mult = 0;
  for (let i = 0; i < 5; ++i) {
    mult += Math.pow(costMultiplier, initialPriceMult + i);
  }
  const upgradeCost15 = CorporationConstants.OfficeInitialCost * mult;

  //Calculate max upgrade size and cost
  const maxMult = corp.funds.dividedBy(CorporationConstants.OfficeInitialCost).toNumber();
  let maxNum = 1;
  mult = Math.pow(costMultiplier, initialPriceMult);
  while (maxNum < 50) {
    //Hard cap of 50x (extra 150 employees)
    if (mult >= maxMult) break;
    const multIncrease = Math.pow(costMultiplier, initialPriceMult + maxNum);
    if (mult + multIncrease > maxMult) {
      break;
    } else {
      mult += multIncrease;
    }
    ++maxNum;
  }
  const upgradeCostMax = CorporationConstants.OfficeInitialCost * mult;

  function upgradeSize(cost: number, size: number): void {
    if (corp.funds.lt(cost)) {
      return;
    }

    UpgradeOfficeSize(corp, props.office, size);
    props.rerender();

    props.rerender();
    props.onClose();
  }

  interface IUpgradeButton {
    cost: number;
    size: number;
    corp: ICorporation;
  }

  function UpgradeSizeButton(props: IUpgradeButton): React.ReactElement {
    return (
      <Tooltip title={numeralWrapper.formatMoney(props.cost)}>
        <span>
          <Button disabled={corp.funds.lt(props.cost)} onClick={() => upgradeSize(props.cost, props.size)}>
            +{props.size}
          </Button>
        </span>
      </Tooltip>
    );
  }

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Typography>Increase the size of your office space to fit additional employees!</Typography>
      <Box display="flex" alignItems="center">
        <Typography>Upgrade size: </Typography>
        <UpgradeSizeButton corp={corp} cost={upgradeCost} size={CorporationConstants.OfficeInitialSize} />
        <UpgradeSizeButton corp={corp} cost={upgradeCost15} size={CorporationConstants.OfficeInitialSize * 5} />
        <UpgradeSizeButton corp={corp} cost={upgradeCostMax} size={maxNum * CorporationConstants.OfficeInitialSize} />
      </Box>
    </Modal>
  );
}
