import React, { useState } from "react";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { ThemeEditorModal } from "./ThemeEditorModal";
import { IRouter } from "../../ui/Router";
import ColorizeIcon from "@mui/icons-material/Colorize";

interface IProps {
  router: IRouter;
}

export function ThemeEditorButton({ router }: IProps): React.ReactElement {
  const [themeEditorOpen, setThemeEditorOpen] = useState(false);
  return (
    <>
      <Tooltip title="The theme editor allows you to modify the colors the game uses.">
        <Button id="bb-theme-editor-button" startIcon={<ColorizeIcon />} onClick={() => setThemeEditorOpen(true)}>
          Theme Editor
        </Button>
      </Tooltip>
      <ThemeEditorModal open={themeEditorOpen} onClose={() => setThemeEditorOpen(false)} router={router} />
    </>
  );
}
