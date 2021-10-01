// React Component for the element that contains the actual info/data
// for the Corporation UI. This panel lies below the header tabs and will
// be filled with whatever is needed based on the routing/navigation
import React from "react";

import { CityTabs } from "./CityTabs";
import { IIndustry } from "../IIndustry";
import { Context, useCorporation } from "./Context";

import { CityName } from "../../Locations/data/CityNames";

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
