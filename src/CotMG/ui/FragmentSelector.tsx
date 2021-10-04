import React, { useState } from "react";
import { Fragments, Fragment, NoneFragment, DeleteFragment } from "../Fragment";
import { FragmentType } from "../FragmentType";
import { IStaneksGift } from "../IStaneksGift";
import { G } from "./G";
import { numeralWrapper } from "../../ui/numeralFormat";

import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

type IOptionProps = {
  gift: IStaneksGift;
  fragment: Fragment;
  selectFragment: (fragment: Fragment) => void;
};

function FragmentOption(props: IOptionProps): React.ReactElement {
  const remaining =
    props.fragment.limit !== Infinity ? (
      <>{props.fragment.limit - props.gift.count(props.fragment)} remaining</>
    ) : (
      <></>
    );
  return (
    <>
      <Typography>
        {FragmentType[props.fragment.type]}
        <br />
        power: {numeralWrapper.formatStaneksGiftPower(props.fragment.power)}
        <br />
        {remaining}
      </Typography>
      <br />
      <G
        width={props.fragment.width()}
        height={props.fragment.height()}
        colorAt={(x, y) => (props.fragment.fullAt(x, y) ? "green" : "")}
      />
    </>
  );
}

type IProps = {
  gift: IStaneksGift;
  selectFragment: (fragment: Fragment) => void;
};

export function FragmentSelector(props: IProps): React.ReactElement {
  const [value, setValue] = useState<string | number>("None");
  function onChange(event: SelectChangeEvent<string | number>): void {
    const v = event.target.value;
    setValue(v);
    if (v === "None") props.selectFragment(NoneFragment);
    else if (v === "Delete") props.selectFragment(DeleteFragment);
    if (typeof v === "number") props.selectFragment(Fragments[v]);
  }
  return (
    <Select sx={{ width: "100%" }} onChange={onChange} value={value}>
      <MenuItem value="None">
        <Typography>None</Typography>
      </MenuItem>
      <MenuItem value="Delete">
        <Typography>Delete</Typography>
      </MenuItem>
      {Fragments.map((fragment) => (
        <MenuItem key={fragment.id} value={fragment.id}>
          <FragmentOption
            key={fragment.id}
            gift={props.gift}
            selectFragment={props.selectFragment}
            fragment={fragment}
          />
        </MenuItem>
      ))}
    </Select>
  );
}
