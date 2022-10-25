// React Component for managing the Corporation's Industry UI
// This Industry component does NOT include the city tabs at the top
import React from "react";

import { IndustryOffice } from "./IndustryOffice";
import { IndustryOverview } from "./IndustryOverview";
import { IndustryWarehouse } from "./IndustryWarehouse";
import { Warehouse } from "../Warehouse";
import { OfficeSpace } from "../OfficeSpace";
import { useCorporation, useDivision } from "./Context";
import Box from "@mui/material/Box";
import { CityName } from "../../Locations/data/CityNames";

interface IProps {
  city: CityName;
  warehouse: Warehouse | 0;
  office: OfficeSpace;
  rerender: () => void;
}

export function Industry(props: IProps): React.ReactElement {
  const corp = useCorporation();
  const division = useDivision();
  return (
    <Box display="flex">
      <Box sx={{ width: "50%" }}>
        <IndustryOverview rerender={props.rerender} />
        <IndustryOffice rerender={props.rerender} office={props.office} />
      </Box>
      <Box sx={{ width: "50%" }}>
        <IndustryWarehouse
          rerender={props.rerender}
          corp={corp}
          currentCity={props.city}
          division={division}
          warehouse={props.warehouse}
        />
      </Box>
    </Box>
  );
}
