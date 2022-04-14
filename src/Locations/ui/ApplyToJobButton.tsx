/**
 * React Component for a button that's used to apply for a job
 */
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import * as React from "react";

import type { Company } from "../../Company/Company";
import type { CompanyPosition } from "../../Company/CompanyPosition";
import { getJobRequirementText } from "../../Company/GetJobRequirementText";
import { use } from "../../ui/Context";

type IProps = {
  company: Company;
  entryPosType: CompanyPosition;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
  text: string;
};

export function ApplyToJobButton(props: IProps): React.ReactElement {
  const player = use.Player();

  function getJobRequirementTooltip(): string {
    const pos = player.getNextCompanyPosition(props.company, props.entryPosType);
    if (pos == null) {
      return "";
    }

    if (!props.company.hasPosition(pos)) {
      return "";
    }

    return getJobRequirementText(props.company, pos, true);
  }

  return (
    <>
      <Tooltip title={<span dangerouslySetInnerHTML={{ __html: getJobRequirementTooltip() }}></span>}>
        <Button onClick={props.onClick}>{props.text}</Button>
      </Tooltip>
    </>
  );
}
