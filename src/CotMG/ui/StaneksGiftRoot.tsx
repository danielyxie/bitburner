import * as React from "react";
import { Grid } from "./Grid";
import { IStaneksGift } from "../IStaneksGift";

type IProps = {
  staneksGift: IStaneksGift;
};

export function StaneksGiftRoot({ staneksGift }: IProps): React.ReactElement {
  return (
    <>
      <h1>Stanek's Gift</h1>
      <Grid gift={staneksGift} />
    </>
  );
}
