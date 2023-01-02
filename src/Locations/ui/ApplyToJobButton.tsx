import * as React from "react";

import { Company } from "../../Company/Company";
import { CompanyPosition } from "../../Company/CompanyPosition";
import { getJobRequirementText } from "../../Company/GetJobRequirementText";

import { Player } from "@player";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";

type IProps = {
  company: Company;
  entryPosType: CompanyPosition;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
  text: string;
};

/** React Component for a button that's used to apply for a job */
export function ApplyToJobButton(props: IProps): React.ReactElement {
  function getJobRequirementTooltip(): string {
    const pos = Player.getNextCompanyPosition(props.company, props.entryPosType);
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
