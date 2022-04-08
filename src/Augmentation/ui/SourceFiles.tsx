import { ListItemButton, ListItemText, Paper } from "@mui/material";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import { Exploit, ExploitName } from "../../Exploits/Exploit";
import { Player } from "../../Player";
import { OwnedAugmentationsOrderSetting } from "../../Settings/SettingEnums";
import { Settings } from "../../Settings/Settings";
import { SourceFile } from "../../SourceFile/SourceFile";
import { SourceFiles } from "../../SourceFile/SourceFiles";

interface SfMinus1 {
  info: React.ReactElement;
  n: number;
  name: string;
}

const safeGetSf = (sfNum: number): SourceFile | SfMinus1 | null => {
  if (sfNum === -1) {
    return {
      info: (
        <>
          This Source-File can only be acquired with obscure knowledge of the game, javascript, and the web ecosystem.
          <br />
          <br />
          It increases all of the player's multipliers by 0.1%
          <br />
          <br />
          You have found the following exploits:
          <br />
          <br />
          {Player.exploits.map((c: Exploit) => (
            <React.Fragment key={c}>
              * {ExploitName(c)}
              <br />
            </React.Fragment>
          ))}
        </>
      ),
      lvl: Player.exploits.length,
      n: -1,
      name: "Source-File -1: Exploits in the BitNodes",
    };
  }

  const srcFileKey = "SourceFile" + sfNum;
  const sfObj = SourceFiles[srcFileKey];
  if (sfObj == null) {
    console.error(`Invalid source file number: ${sfNum}`);
    return null;
  }
  return sfObj;
};

export function SourceFilesElement(): React.ReactElement {
  const sourceSfs = Player.sourceFiles.slice();
  const exploits = Player.exploits;

  if (Settings.OwnedAugmentationsOrder === OwnedAugmentationsOrderSetting.Alphabetically) {
    sourceSfs.sort((sf1, sf2) => {
      return sf1.n - sf2.n;
    });
  }

  const [selectedSf, setSelectedSf] = useState<any>(sourceSfs[0]);

  if (sourceSfs.length === 0) {
    return <></>;
  }

  return (
    <Box sx={{ width: "100%", mt: 1 }}>
      <Paper sx={{ p: 1 }}>
        <Typography variant="h5">Source Files</Typography>
      </Paper>
      <Paper sx={{ display: "grid", gridTemplateColumns: "1fr 3fr" }}>
        <Box>
          <List
            sx={{ height: 400, overflowY: "scroll", borderRight: `1px solid ${Settings.theme.welllight}` }}
            disablePadding
          >
            {exploits.length > 0 && (
              <ListItemButton
                key={-1}
                onClick={() => setSelectedSf({ n: -1, lvl: exploits.length })}
                selected={selectedSf.n === -1}
                sx={{ py: 0 }}
              >
                <ListItemText
                  disableTypography
                  primary={<Typography>Source-File -1: Exploits in the BitNodes</Typography>}
                  secondary={
                    <Typography>
                      Level {exploits.length} / {Object.keys(Exploit).length}
                    </Typography>
                  }
                />
              </ListItemButton>
            )}

            {sourceSfs.map((e, i) => {
              const sfObj = safeGetSf(e.n);
              if (!sfObj) return;
              const maxLevel = sfObj?.n === 12 ? "∞" : "3";

              return (
                <ListItemButton key={i + 1} onClick={() => setSelectedSf(e)} selected={selectedSf === e} sx={{ py: 0 }}>
                  <ListItemText
                    disableTypography
                    primary={<Typography>{sfObj.name}</Typography>}
                    secondary={
                      <Typography>
                        Level {e.lvl} / {maxLevel}
                      </Typography>
                    }
                  />
                </ListItemButton>
              );
            })}
          </List>
        </Box>
        <Box sx={{ m: 1 }}>
          <Typography variant="h6" sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
            {safeGetSf(selectedSf.n)?.name}
          </Typography>
          <Typography sx={{ maxHeight: 350, overflowY: "scroll" }}>
            {(() => {
              const sfObj = safeGetSf(selectedSf.n);
              if (!sfObj) return;

              let maxLevel;
              switch (sfObj?.n) {
                case 12:
                  maxLevel = "∞";
                  break;
                case -1:
                  maxLevel = Object.keys(Exploit).length;
                  break;
                default:
                  maxLevel = "3";
              }

              return (
                <>
                  Level {selectedSf.lvl} / {maxLevel}
                  <br />
                  <br />
                  {sfObj?.info}
                </>
              );
            })()}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
