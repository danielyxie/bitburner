import React, { useContext } from "react";

import type { IGang } from "../IGang";

export const Context: {
  Gang: React.Context<IGang>;
} = {
  Gang: React.createContext<IGang>({} as IGang),
};

export const useGang = (): IGang => useContext(Context.Gang);
