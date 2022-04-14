import PaletteSharpIcon from "@mui/icons-material/PaletteSharp";
import { Button, Card, CardContent, CardHeader, CardMedia, Link } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import React from "react";

import { Settings } from "../../Settings/Settings";
import type { IPredefinedTheme } from "../Themes";

interface IProps {
  theme: IPredefinedTheme;
  onActivated: () => void;
  onImageClick: (src: string) => void;
}

export function ThemeEntry({ theme, onActivated, onImageClick }: IProps): React.ReactElement {
  if (!theme) return <></>;
  return (
    <Card key={theme.screenshot} sx={{ width: 400, mr: 1, mb: 1 }}>
      <CardHeader
        action={
          <Tooltip title="Use this theme">
            <Button startIcon={<PaletteSharpIcon />} onClick={onActivated} variant="outlined">
              Use
            </Button>
          </Tooltip>
        }
        title={theme.name}
        subheader={
          <>
            by {theme.credit}{" "}
            {theme.reference && (
              <>
                (
                <Link href={theme.reference} target="_blank">
                  ref
                </Link>
                )
              </>
            )}
          </>
        }
        sx={{
          color: Settings.theme.primary,
          "& .MuiCardHeader-subheader": {
            color: Settings.theme.secondarydark,
          },
          "& .MuiButton-outlined": {
            backgroundColor: "transparent",
          },
        }}
      />
      <CardMedia
        component="img"
        width="400"
        image={theme.screenshot}
        alt={`Theme Screenshot of "${theme.name}"`}
        sx={{
          borderTop: `1px solid ${Settings.theme.welllight}`,
          borderBottom: `1px solid ${Settings.theme.welllight}`,
          cursor: "zoom-in",
        }}
        onClick={() => onImageClick(theme.screenshot)}
      />
      <CardContent>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            color: Settings.theme.primarydark,
          }}
        >
          {theme.description}
        </Typography>
      </CardContent>
    </Card>
  );
}
