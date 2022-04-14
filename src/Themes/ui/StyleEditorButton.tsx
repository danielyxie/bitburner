import TextFormatIcon from "@mui/icons-material/TextFormat";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import React, { useState } from "react";

import { StyleEditorModal } from "./StyleEditorModal";

export function StyleEditorButton(): React.ReactElement {
  const [styleEditorOpen, setStyleEditorOpen] = useState(false);
  return (
    <>
      <Tooltip title="The style editor allows you to modify certain CSS rules used by the game.">
        <Button startIcon={<TextFormatIcon />} onClick={() => setStyleEditorOpen(true)}>
          Style Editor
        </Button>
      </Tooltip>
      <StyleEditorModal open={styleEditorOpen} onClose={() => setStyleEditorOpen(false)} />
    </>
  );
}
