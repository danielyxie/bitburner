import React from "react";
import { IIndustry } from "../IIndustry";
import { MathJaxWrapper } from "../../MathJaxWrapper";

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
  const prod = props.division.prodMats.map((p) => `1\\text{ }${p}`);
  if (props.division.makesProducts) {
    prod.push("Products");
  }

  return (
    <MathJaxWrapper>{"\\(" + reqs.join("+") + `\\Rightarrow ` + prod.join("+") + "\\)"}</MathJaxWrapper>
  );
}
