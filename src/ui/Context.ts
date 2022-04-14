import React, { useContext } from "react";

import type { IPlayer } from "../PersonObjects/IPlayer";

import type { IRouter } from "./Router";

export const Context: {
  Player: React.Context<IPlayer>;
  Router: React.Context<IRouter>;
} = {
  Player: React.createContext<IPlayer>({} as IPlayer),
  Router: React.createContext<IRouter>({} as IRouter),
};

export const use: {
  Player: () => IPlayer;
  Router: () => IRouter;
} = {
  Player: () => useContext(Context.Player),
  Router: () => useContext(Context.Router),
};
