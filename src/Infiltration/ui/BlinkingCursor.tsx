import React, { useState, useEffect } from "react";

export function BlinkingCursor(): React.ReactElement {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const i = setInterval(() => setOn((old) => !old), 1000);
    return () => clearInterval(i);
  });
  return <>{on ? "|" : ""}</>;
}
