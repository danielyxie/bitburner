import { Typography } from "@mui/material";
import React, { useState, useEffect } from "react";

interface baubleProps {
  isConnected: () => boolean;
}

export const ConnectionBauble = (props: baubleProps): React.ReactElement => {
  const [connection, setConnection] = useState(props.isConnected());

  useEffect(() => {
    const timer = setInterval(() => {
      setConnection(props.isConnected());
    }, 1000);
    return () => clearInterval(timer);
  });

  return <Typography>{connection ? "Connected" : "Disconnected"}</Typography>;
};
