import { Box, Container, Typography } from "@mui/material";
import React, { useState } from "react";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { IRouter } from "../../ui/Router";
import { GameOptionsTab } from "../GameOptionsTab";
import { GameOptionsSidebar } from "./GameOptionsSidebar";
import { GameplayPage } from "./GameplayPage";
import { InterfacePage } from "./InterfacePage";
import { MiscPage } from "./MiscPage";
import { RemoteAPIPage } from "./RemoteAPIPage";
import { SystemPage } from "./SystemPage";

interface IProps {
  player: IPlayer;
  router: IRouter;
  save: () => void;
  export: () => void;
  forceKill: () => void;
  softReset: () => void;
}

export function GameOptionsRoot(props: IProps): React.ReactElement {
  const [currentTab, setCurrentTab] = useState(GameOptionsTab.SYSTEM);

  return (
    <Container disableGutters maxWidth="lg" sx={{ mx: 0 }}>
      <Typography variant="h4">Options</Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 3fr", gap: 1 }}>
        <GameOptionsSidebar
          tab={currentTab}
          setTab={(tab: GameOptionsTab) => setCurrentTab(tab)}
          player={props.player}
          router={props.router}
          save={props.save}
          export={props.export}
          forceKill={props.forceKill}
          softReset={props.softReset}
        />
        {currentTab === GameOptionsTab.SYSTEM && <SystemPage />}
        {currentTab === GameOptionsTab.INTERFACE && <InterfacePage />}
        {currentTab === GameOptionsTab.GAMEPLAY && <GameplayPage />}
        {currentTab === GameOptionsTab.MISC && <MiscPage />}
        {currentTab === GameOptionsTab.REMOTE_API && <RemoteAPIPage />}
      </Box>
    </Container>
  );
}
