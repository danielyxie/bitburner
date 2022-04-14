import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";

import { numeralWrapper } from "../../ui/numeralFormat";
import type { Fragment } from "../Fragment";
import { DeleteFragment, Fragments, NoneFragment } from "../Fragment";
import { Effect, FragmentType } from "../FragmentType";
import type { IStaneksGift } from "../IStaneksGift";

import { FragmentPreview } from "./FragmentPreview";

type IOptionProps = {
  gift: IStaneksGift;
  fragment: Fragment;
  selectFragment: (fragment: Fragment) => void;
};

function FragmentOption(props: IOptionProps): React.ReactElement {
  const left = props.fragment.limit - props.gift.count(props.fragment);
  const remaining = props.fragment.limit !== Infinity ? <>{left} remaining</> : <></>;
  return (
    <Box display="flex">
      <Box sx={{ mx: 2 }}>
        <FragmentPreview
          width={props.fragment.width(0)}
          height={props.fragment.height(0)}
          colorAt={(x, y) => {
            if (!props.fragment.fullAt(x, y, 0)) return "";
            if (left === 0) return "grey";
            return props.fragment.type === FragmentType.Booster ? "blue" : "green";
          }}
        />
      </Box>
      <Typography>
        {props.fragment.type === FragmentType.Booster
          ? `${props.fragment.power}x adjacent fragment power`
          : Effect(props.fragment.type)}
        <br />
        power: {numeralWrapper.formatStaneksGiftPower(props.fragment.power)}
        <br />
        {remaining}
      </Typography>
    </Box>
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
    if (v === "None") {
      props.selectFragment(NoneFragment);
      return;
    } else if (v === "Delete") {
      props.selectFragment(DeleteFragment);
      return;
    }
    const fragment = Fragments.find((f) => f.id === v);
    if (fragment === undefined) throw new Error("Fragment selector selected an undefined fragment with id " + v);
    if (typeof v === "number") props.selectFragment(fragment);
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
