// React Components for the Corporation UI's City navigation tabs
// These allow player to navigate between different cities for each industry
import React, { useState } from "react";
import { CityTab } from "./CityTab";
import { ExpandNewCityPopup } from "./ExpandNewCityPopup";
import { createPopup } from "../../ui/React/createPopup";
import { ICorporation } from "../ICorporation";
import { IIndustry } from "../IIndustry";
import { OfficeSpace } from "../OfficeSpace";
import { Industry } from "./Industry";
import { IPlayer } from "../../PersonObjects/IPlayer";

interface IProps {
  city: string;
  division: IIndustry;
  corp: ICorporation;
  player: IPlayer;
}

export function CityTabs(props: IProps): React.ReactElement {
  const [city, setCity] = useState(props.city);

  function openExpandNewCityModal(): void {
    const popupId = "cmpy-mgmt-expand-city-popup";
    createPopup(popupId, ExpandNewCityPopup, {
      popupId: popupId,
      corp: props.corp,
      division: props.division,
      cityStateSetter: setCity,
    });
  }

  const office = props.division.offices[city];
  if (office === 0) {
    setCity("Sector-12");
    return <></>;
  }

  return (
    <>
      {Object.values(props.division.offices).map(
        (office: OfficeSpace | 0) => office !== 0 && (
            <CityTab
              current={city === office.loc}
              key={office.loc}
              name={office.loc}
              onClick={() => setCity(office.loc)}
            />
          ),
      )}
      <CityTab
        current={false}
        key={"Expand into new City"}
        name={"Expand into new City"}
        onClick={openExpandNewCityModal}
      />
      <Industry
        corp={props.corp}
        division={props.division}
        city={city}
        warehouse={props.division.warehouses[city]}
        office={office}
        player={props.player}
      />
    </>
  );
}
