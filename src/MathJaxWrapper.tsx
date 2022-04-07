import React from "react";
import { MathJax, MathJaxContext } from "better-react-mathjax";

interface IProps {
  children: React.ReactNode;
}

export function MathJaxWrapper({ children }: IProps): React.ReactElement {
  return (
    <MathJaxContext version={3} src={"dist/ext/MathJax-3.2.0/es5/tex-chtml.js"}>
      <MathJax>{children}</MathJax>
    </MathJaxContext>
  );
}
