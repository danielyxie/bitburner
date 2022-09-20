import React, { useContext } from "react";
import { Corporation } from "../Corporation";
import { Industry } from "../Industry";

export const Context: {
  Corporation: React.Context<Corporation>;
  Division: React.Context<Industry>;
} = {
  Corporation: React.createContext<Corporation>({} as Corporation),
  Division: React.createContext<Industry>({} as Industry),
};

export const useCorporation = (): Corporation => useContext(Context.Corporation);
export const useDivision = (): Industry => useContext(Context.Division);
