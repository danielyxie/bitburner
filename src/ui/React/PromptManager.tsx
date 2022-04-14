import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";

import { EventEmitter } from "../../utils/EventEmitter";
import { KEY } from "../../utils/helpers/keyCodes";

import { Modal } from "./Modal";

export const PromptEvent = new EventEmitter<[Prompt]>();

interface Prompt {
  txt: string;
  options?: { type?: string; choices?: string[] };
  resolve: (result: boolean | string) => void;
}

export function PromptManager(): React.ReactElement {
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  useEffect(() => {
    return PromptEvent.subscribe((p: Prompt) => {
      setPrompt(p);
    });
  }, []);

  if (prompt === null) {
    return <></>;
  }

  function close(): void {
    if (prompt === null) return;
    if (["text", "select"].includes(prompt?.options?.type ?? "")) {
      prompt.resolve("");
    } else {
      prompt.resolve(false);
    }
    setPrompt(null);
  }

  const types: { [key: string]: any } = {
    text: PromptMenuText,
    select: PromptMenuSelect,
  };

  let PromptContent = PromptMenuBoolean;
  if (prompt?.options?.type && ["text", "select"].includes(prompt?.options?.type))
    PromptContent = types[prompt?.options?.type];
  const resolve = (value: boolean | string): void => {
    prompt.resolve(value);
    setPrompt(null);
  };

  return (
    <Modal open={true} onClose={close}>
      <pre>
        <Typography>{prompt.txt}</Typography>
      </pre>
      <PromptContent prompt={prompt} resolve={resolve} />
    </Modal>
  );
}

interface IContentProps {
  prompt: Prompt;
  resolve: (value: boolean | string) => void;
}

function PromptMenuBoolean({ resolve }: IContentProps): React.ReactElement {
  const yes = (): void => resolve(true);
  const no = (): void => resolve(false);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", paddingTop: "10px" }}>
        <Button style={{ marginRight: "auto" }} onClick={yes}>
          Yes
        </Button>
        <Button onClick={no}>No</Button>
      </div>
    </>
  );
}

function PromptMenuText({ resolve }: IContentProps): React.ReactElement {
  const [value, setValue] = useState("");

  const submit = (): void => resolve(value);

  const onInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    event.stopPropagation();

    if (event.key === KEY.ENTER) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", paddingTop: "10px" }}>
        <TextField
          autoFocus
          value={value}
          onInput={onInput}
          onKeyDown={onKeyDown}
          style={{ flex: "1 0 auto" }}
          InputProps={{
            endAdornment: <Button onClick={submit}>Confirm</Button>,
          }}
        />
      </div>
    </>
  );
}

function PromptMenuSelect({ prompt, resolve }: IContentProps): React.ReactElement {
  const [value, setValue] = useState("");

  const submit = (): void => resolve(value);

  const onChange = (event: SelectChangeEvent<string>): void => {
    setValue(event.target.value);
  };

  const getItems = (choices: string[]): React.ReactElement[] => {
    const content = [];
    for (const i of choices) {
      // @ts-ignore
      content.push(
        <MenuItem key={i} value={i}>
          {i}
        </MenuItem>,
      );
    }
    return content;
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", paddingTop: "10px" }}>
        <Select onChange={onChange} value={value} style={{ flex: "1 0 auto" }}>
          {getItems(prompt?.options?.choices || [])}
        </Select>
        <Button onClick={submit} disabled={value === ""}>
          Confirm
        </Button>
      </div>
    </>
  );
}
