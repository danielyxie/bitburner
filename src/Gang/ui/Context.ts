import React, { useContext } from "react";
import { Gang } from "../Gang";

export const Context = {
  Gang: React.createContext<Gang>({} as Gang),
};

export const useGang = (): Gang => useContext(Context.Gang);
