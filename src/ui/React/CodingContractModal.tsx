import React, { useState, useEffect } from "react";
import { KEY } from "../../utils/helpers/keyCodes";

import { CodingContract, CodingContractTypes } from "../../CodingContracts";
import { CopyableText } from "./CopyableText";
import { Modal } from "./Modal";
import { EventEmitter } from "../../utils/EventEmitter";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

interface IProps {
  c: CodingContract;
  onClose: () => void;
  onAttempt: (answer: string) => void;
}

export const CodingContractEvent = new EventEmitter<[IProps]>();

export function CodingContractModal(): React.ReactElement {
  const [props, setProps] = useState<IProps | null>(null);
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    CodingContractEvent.subscribe((props) => setProps(props));
  });
  if (props === null) return <></>;

  function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setAnswer(event.target.value);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (props === null) return;
    // React just won't cooperate on this one.
    // "React.KeyboardEvent<HTMLInputElement>" seems like the right type but
    // whatever ...
    const value = (event.target as any).value;

    if (event.keyCode === KEY.ENTER && value !== "") {
      event.preventDefault();
      props.onAttempt(answer);
      close();
    }
  }

  function close(): void {
    if (props === null) return;
    props.onClose();
    setProps(null);
  }

  const contractType = CodingContractTypes[props.c.type];
  const description = [];
  for (const [i, value] of contractType.desc(props.c.data).split("\n").entries())
    description.push(<span key={i} dangerouslySetInnerHTML={{ __html: value + "<br />" }}></span>);
  return (
    <Modal open={props !== null} onClose={close}>
      <CopyableText variant="h4" value={props.c.type} />
      <Typography>
        You are attempting to solve a Coding Contract. You have {props.c.getMaxNumTries() - props.c.tries} tries
        remaining, after which the contract will self-destruct.
      </Typography>
      <br />
      <Typography>{description}</Typography>
      <br />
      <TextField
        autoFocus
        placeholder="Enter Solution here"
        value={answer}
        onChange={onChange}
        onKeyDown={onKeyDown}
        InputProps={{
          endAdornment: (
            <Button
              onClick={() => {
                props.onAttempt(answer);
                close();
              }}
            >
              Solve
            </Button>
          ),
        }}
      />
    </Modal>
  );
}
