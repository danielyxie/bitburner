import React from "react";
import { IIndustry } from "../IIndustry";
import { MathJax, MathJaxContext } from "better-react-mathjax";

interface IProps {
  division: IIndustry;
}

export function IndustryProductEquation(props: IProps): React.ReactElement {
  const reqs = [];
  for (const reqMat of Object.keys(props.division.reqMats)) {
    const reqAmt = props.division.reqMats[reqMat];
    if (reqAmt === undefined) continue;
    reqs.push(String.raw`${reqAmt}\text{ }${reqMat}`);
  }
  const prod = props.division.prodMats.slice();
  if (props.division.makesProducts) {
    prod.push(props.division.type);
  }

  return (
    <MathJaxContext>
      <MathJax>
        {reqs.join("+") + String.raw`\Rightarrow` + prod.map((p) => String.raw`1\text{ }${p}`).join("+")}
      </MathJax>
    </MathJaxContext>
  );
}
