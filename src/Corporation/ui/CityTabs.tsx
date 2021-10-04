// React Components for the Corporation UI's City navigation tabs
// These allow player to navigate between different cities for each industry
import React, { useState } from "react";
import { OfficeSpace } from "../OfficeSpace";
import { Industry } from "./Industry";
import { ExpandNewCity } from "./ExpandNewCity";
import { useDivision } from "./Context";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

interface IProps {
  city: string;
  rerender: () => void;
}

export function CityTabs(props: IProps): React.ReactElement {
  const division = useDivision();
  const [city, setCity] = useState(props.city);

  const office = division.offices[city];
  if (office === 0) {
    setCity("Sector-12");
    return <></>;
  }

  const canExpand =
    Object.keys(division.offices).filter((cityName: string) => division.offices[cityName] === 0).length > 0;
  function handleChange(event: React.SyntheticEvent, tab: string): void {
    setCity(tab);
  }
  return (
    <>
      <Tabs variant="fullWidth" value={city} onChange={handleChange}>
        {Object.values(division.offices).map(
          (office: OfficeSpace | 0) => office !== 0 && <Tab key={office.loc} label={office.loc} value={office.loc} />,
        )}
        {canExpand && <Tab label={"Expand"} value={"Expand"} />}
      </Tabs>

      {city !== "Expand" ? (
        <Industry
          key={city}
          rerender={props.rerender}
          city={city}
          warehouse={division.warehouses[city]}
          office={office}
        />
      ) : (
        <ExpandNewCity cityStateSetter={setCity} />
      )}
    </>
  );
}
