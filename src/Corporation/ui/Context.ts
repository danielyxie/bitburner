import React, { useContext } from "react";
import { ICorporation } from "../ICorporation";

export const Context: {
  Corporation: React.Context<ICorporation>;
} = {
  Corporation: React.createContext<ICorporation>({} as ICorporation),
};

export const useCorporation = () => useContext(Context.Corporation);
