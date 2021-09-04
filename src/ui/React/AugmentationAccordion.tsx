/**
 * React Component for displaying a single Augmentation as an accordion.
 *
 * The header of the accordion contains the Augmentation's name (and level, if
 * applicable), and the accordion's panel contains the Augmentation's description.
 */
import * as React from "react";

import { Accordion } from "./Accordion";

import { Augmentation } from "../../Augmentation/Augmentation";
import { AugmentationNames } from "../../Augmentation/data/AugmentationNames";

type IProps = {
  aug: Augmentation;
  level?: number | string | null;
};

export function AugmentationAccordion(props: IProps): React.ReactElement {
  let displayName = props.aug.name;
  if (props.level != null) {
    if (props.aug.name === AugmentationNames.NeuroFluxGovernor) {
      displayName += ` - Level ${props.level}`;
    }
  }

  if (typeof props.aug.info === "string") {
    return (
      <Accordion
        headerContent={<>{displayName}</>}
        panelContent={
          <p>
            <span dangerouslySetInnerHTML={{ __html: props.aug.info }} />
            <br />
            <br />
            {props.aug.stats}
          </p>
        }
      />
    );
  }

  return (
    <Accordion
      headerContent={<>{displayName}</>}
      panelContent={
        <p>
          {props.aug.info}
          <br />
          <br />
          {props.aug.stats}
        </p>
      }
    />
  );
}
