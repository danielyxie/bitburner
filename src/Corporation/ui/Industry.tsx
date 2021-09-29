// React Component for managing the Corporation's Industry UI
// This Industry component does NOT include the city tabs at the top
import React from "react";

import { IndustryOffice } from "./IndustryOffice";
import { IndustryOverview } from "./IndustryOverview";
import { IndustryWarehouse } from "./IndustryWarehouse";
import { Warehouse } from "../Warehouse";
import { OfficeSpace } from "../OfficeSpace";
import { use } from "../../ui/Context";
import { useCorporation, useDivision } from "./Context";

interface IProps {
  city: string;
  warehouse: Warehouse | 0;
  office: OfficeSpace;
  rerender: () => void;
}

export function Industry(props: IProps): React.ReactElement {
  const player = use.Player();
  const corp = useCorporation();
  const division = useDivision();
  return (
    <div>
      <div className={"cmpy-mgmt-industry-left-panel"}>
        <IndustryOverview rerender={props.rerender} currentCity={props.city} office={props.office} />
        <IndustryOffice rerender={props.rerender} office={props.office} />
      </div>
      <div className={"cmpy-mgmt-industry-right-panel"}>
        <IndustryWarehouse
          rerender={props.rerender}
          player={player}
          corp={corp}
          currentCity={props.city}
          division={division}
          warehouse={props.warehouse}
        />
      </div>
    </div>
  );
}
