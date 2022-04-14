import { Box, Button, Container, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

import { use } from "../../../ui/Context";

import { FAQModal } from "./FAQModal";
import { SleeveElem } from "./SleeveElem";

export function SleeveRoot(): React.ReactElement {
  const player = use.Player();
  const [FAQOpen, setFAQOpen] = useState(false);
  const setRerender = useState(false)[1];
  function rerender(): void {
    setRerender((old) => !old);
  }

  useEffect(() => {
    const id = setInterval(rerender, 200);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <Container disableGutters maxWidth="md" sx={{ mx: 0 }}>
        <Typography variant="h4">Sleeves</Typography>
        <Typography>
          Duplicate Sleeves are MK-V Synthoids (synthetic androids) into which your consciousness has been copied. In
          other words, these Synthoids contain a perfect duplicate of your mind.
          <br />
          <br />
          Sleeves can be used to perform different tasks synchronously.
          <br />
          <br />
        </Typography>
      </Container>

      <Button onClick={() => setFAQOpen(true)}>FAQ</Button>
      <Button
        href="https://bitburner.readthedocs.io/en/latest/advancedgameplay/sleeves.html#duplicate-sleeves"
        target="_blank"
      >
        Wiki Documentation
      </Button>
      <Box display="grid" sx={{ gridTemplateColumns: "repeat(2, 1fr)", mt: 1 }}>
        {player.sleeves.map((sleeve, i) => (
          <SleeveElem key={i} rerender={rerender} sleeve={sleeve} />
        ))}
      </Box>
      <FAQModal open={FAQOpen} onClose={() => setFAQOpen(false)} />
    </>
  );
}
