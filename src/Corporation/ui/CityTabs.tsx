// React Components for the Corporation UI's City navigation tabs
// These allow player to navigate between different cities for each industry
import React, { useState } from "react";
import { OfficeSpace } from "../OfficeSpace";
import { Industry } from "./Industry";
import { ExpandNewCity } from "./ExpandNewCity";
import { useDivision } from "./Context";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { CityName } from "../../Locations/data/CityNames";

interface IProps {
  city: CityName | "Expand";
  rerender: () => void;
}

export function CityTabs(props: IProps): React.ReactElement {
  const division = useDivision();
  const [city, setCity] = useState(props.city);

  let mainContent: JSX.Element;
  if (city === "Expand") {
    mainContent = <ExpandNewCity cityStateSetter={setCity} />;
  } else {
    const office = division.offices[city];
    if (office === 0) {
      setCity(CityName.Sector12);
      return <></>;
    }
    mainContent = (
      <Industry rerender={props.rerender} city={city} warehouse={division.warehouses[city]} office={office} />
    );
  }
  const canExpand = Object.values(CityName).filter((cityName) => division.offices[cityName] === 0).length > 0;
  function handleChange(event: React.SyntheticEvent, tab: CityName | "Expand"): void {
    setCity(tab);
  }

  return (
    <>
      <Tabs variant="fullWidth" value={city} onChange={handleChange} sx={{ maxWidth: "65vw" }}>
        {Object.values(division.offices).map(
          (office: OfficeSpace | 0) => office !== 0 && <Tab key={office.loc} label={office.loc} value={office.loc} />,
        )}
        {canExpand && <Tab label={"Expand"} value={"Expand"} />}
      </Tabs>
      {mainContent}
    </>
  );
}
