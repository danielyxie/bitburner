/**
 * React Component for configuring the way installed augmentations and
 * Source-Files are displayed in the Augmentations UI
 */
import * as React from "react";

import { StdButton } from "../../ui/React/StdButton";

type IProps = {
  collapseAllButtonsFn: () => void;
  expandAllButtonsFn: () => void;
  sortByAcquirementTimeFn: () => void;
  sortInOrderFn: () => void;
};

export function ListConfiguration(props: IProps): React.ReactElement {
  return (
    <>
      <StdButton onClick={props.expandAllButtonsFn} text="Expand All" />
      <StdButton onClick={props.collapseAllButtonsFn} text="Collapse All" />
      <StdButton
        onClick={props.sortInOrderFn}
        text="Sort in Order"
        tooltip="Sorts the Augmentations alphabetically and Source-Files in numeral order"
      />
      <StdButton
        onClick={props.sortByAcquirementTimeFn}
        text="Sort by Acquirement Time"
        tooltip="Sorts the Augmentations and Source-Files based on when you acquired them (same as default)"
      />
    </>
  );
}
