// React Component for managing the Corporation's Industry UI
// This Industry component does NOT include the city tabs at the top
import React from "react";

import { IndustryOffice } from "./IndustryOffice";
import { IndustryOverview } from "./IndustryOverview";
import { IndustryWarehouse } from "./IndustryWarehouse";
import { Warehouse } from "../Warehouse";
import { ICorporation } from "../ICorporation";
import { OfficeSpace } from "../OfficeSpace";
import { IIndustry } from "../IIndustry";
import { IPlayer } from "../../PersonObjects/IPlayer";

interface IProps {
  corp: ICorporation;
  division: IIndustry;
  city: string;
  warehouse: Warehouse | 0;
  office: OfficeSpace;
  player: IPlayer;
}

export function Industry(props: IProps): React.ReactElement {
  return (
    <div>
      <div className={"cmpy-mgmt-industry-left-panel"}>
        <IndustryOverview
          player={props.player}
          corp={props.corp}
          division={props.division}
          currentCity={props.city}
          office={props.office}
        />
        <IndustryOffice
          player={props.player}
          corp={props.corp}
          division={props.division}
          office={props.office}
        />
      </div>
      <div className={"cmpy-mgmt-industry-right-panel"}>
        <IndustryWarehouse
          player={props.player}
          corp={props.corp}
          currentCity={props.city}
          division={props.division}
          warehouse={props.warehouse}
        />
      </div>
    </div>
  );
}
