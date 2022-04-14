// React Component for the element that contains the actual info/data
// for the Corporation UI. This panel lies below the header tabs and will
// be filled with whatever is needed based on the routing/navigation
import React from "react";

import { CityName } from "../../Locations/data/CityNames";
import type { IIndustry } from "../IIndustry";

import { CityTabs } from "./CityTabs";
import { Context, useCorporation } from "./Context";

interface IProps {
  divisionName: string;
  rerender: () => void;
}

export function MainPanel(props: IProps): React.ReactElement {
  const corp = useCorporation();
  const division =
    props.divisionName !== "Overview"
      ? corp.divisions.find((division: IIndustry) => division.name === props.divisionName)
      : undefined; // use undefined because find returns undefined

  if (division === undefined) throw new Error("Cannot find division");
  return (
    <Context.Division.Provider value={division}>
      <CityTabs rerender={props.rerender} city={CityName.Sector12} />
    </Context.Division.Provider>
  );
}
