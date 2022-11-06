/**
 * React Subcomponent for displaying a location's UI, when that location is a gym
 *
 * This subcomponent renders all of the buttons for training at the gym
 */
import * as React from "react";
import Button from "@mui/material/Button";

import { Location } from "../Location";

import { Player } from "@player";

import { Money } from "../../ui/React/Money";
import { Router } from "../../ui/GameRoot";
import { Box } from "@mui/material";
import { ClassWork, ClassType, Classes } from "../../Work/ClassWork";
import { calculateCost } from "../../Work/Formulas";

type IProps = {
  loc: Location;
};

export function GymLocation(props: IProps): React.ReactElement {
  function train(stat: ClassType): void {
    Player.startWork(
      new ClassWork({
        classType: stat,
        location: props.loc.name,
        singularity: false,
      }),
    );
    Player.startFocusing();
    Router.toWork();
  }

  const cost = calculateCost(Classes[ClassType.GymStrength], props.loc);

  return (
    <Box sx={{ display: "grid", width: "fit-content" }}>
      <Button onClick={() => train(ClassType.GymStrength)}>
        Train Strength (<Money money={cost} forPurchase={true} /> / sec)
      </Button>
      <Button onClick={() => train(ClassType.GymDefense)}>
        Train Defense (<Money money={cost} forPurchase={true} /> / sec)
      </Button>
      <Button onClick={() => train(ClassType.GymDexterity)}>
        Train Dexterity (<Money money={cost} forPurchase={true} /> / sec)
      </Button>
      <Button onClick={() => train(ClassType.GymAgility)}>
        Train Agility (<Money money={cost} forPurchase={true} /> / sec)
      </Button>
    </Box>
  );
}
