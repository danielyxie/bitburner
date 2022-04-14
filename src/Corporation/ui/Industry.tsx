// React Component for managing the Corporation's Industry UI
// This Industry component does NOT include the city tabs at the top
import Box from "@mui/material/Box";
import React from "react";

import { use } from "../../ui/Context";
import type { OfficeSpace } from "../OfficeSpace";
import type { Warehouse } from "../Warehouse";

import { useCorporation, useDivision } from "./Context";
import { IndustryOffice } from "./IndustryOffice";
import { IndustryOverview } from "./IndustryOverview";
import { IndustryWarehouse } from "./IndustryWarehouse";

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
    <Box display="flex">
      <Box sx={{ width: "50%" }}>
        <IndustryOverview rerender={props.rerender} currentCity={props.city} office={props.office} />
        <IndustryOffice rerender={props.rerender} office={props.office} />
      </Box>
      <Box sx={{ width: "50%" }}>
        <IndustryWarehouse
          rerender={props.rerender}
          player={player}
          corp={corp}
          currentCity={props.city}
          division={division}
          warehouse={props.warehouse}
        />
      </Box>
    </Box>
  );
}
