import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { EventEmitter } from "../../utils/EventEmitter";
import { Modal } from "../../ui/React/Modal";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from '@mui/material/TextField';
import { KEY } from '../../utils/helpers/keyCodes';
import MenuItem from '@mui/material/MenuItem';

export const PromptEvent = new EventEmitter<[Prompt]>();

interface Prompt {
  txt: string;
  options?: { type?: string; options?: string[] };
  resolve: (result: boolean | string) => void;
}

export function PromptManager(): React.ReactElement {
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  useEffect(
    () =>
      PromptEvent.subscribe((p: Prompt) => {
        setPrompt(p);
      }),
    [],
  );

  const valueState = useState('')

  function close(): void {
    if (prompt === null) return;
    prompt.resolve(false);
    valueState[1]('')
    setPrompt(null);
  }

  let promptRenderer;
  switch (prompt?.options?.type) {
    case 'text': {
      promptRenderer = promptMenuText;
      break;
    }

    case 'select': {
      promptRenderer = promptMenuSelect;
      break;
    }

    default: {
      promptRenderer = promptMenuBoolean;
    }
  }

  return (
    <>
      {prompt != null && (
        <Modal open={true} onClose={close}>
          <Typography>{prompt.txt}</Typography>
          {promptRenderer(prompt, setPrompt, valueState)}
        </Modal>
      )}
    </>
  );
}

function promptMenuBoolean(prompt: Prompt | null, setPrompt: Dispatch<SetStateAction<Prompt | null>>): React.ReactElement {
  const yes = (): void => {
    if (prompt !== null) {
      prompt.resolve(true);
      setPrompt(null);
    }
  }
  const no = (): void => {
    if (prompt !== null) {
      prompt.resolve(false);
      setPrompt(null);
    }
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '10px' }}>
        <Button style={{ marginRight: 'auto' }} onClick={yes}>Yes</Button>
        <Button onClick={no}>No</Button>
      </div>
    </>
  );
}

function promptMenuText(prompt: Prompt | null, setPrompt: Dispatch<SetStateAction<Prompt | null>>, valueState: [string, Dispatch<SetStateAction<string>>]): React.ReactElement {
  const [value, setValue] = valueState

  const submit = (): void => {
    if (prompt !== null) {
      prompt.resolve(value);
      setValue('')
      setPrompt(null);
    }
  }

  const onInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    event.stopPropagation();

    if (prompt !== null && event.keyCode === KEY.ENTER) {
      event.preventDefault();
      submit();
    }
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', paddingTop: '10px' }}>
        <TextField
          autoFocus
          value={value}
          onInput={onInput}
          onKeyDown={onKeyDown}
          style={{ flex: '1 0 auto' }}
          InputProps={{
            endAdornment: (
              <Button
                onClick={() => {
                  submit();
                }}
              >
                Confirm
              </Button>
            ),
          }}
        />
      </div>
    </>
  );
}

function promptMenuSelect(prompt: Prompt | null, setPrompt: Dispatch<SetStateAction<Prompt | null>>, valueState: [string, Dispatch<SetStateAction<string>>]): React.ReactElement {
  const [value, setValue] = valueState

  const submit = (): void => {
    if (prompt !== null) {
      prompt.resolve(value);
      setValue('');
      setPrompt(null);
    }
  }

  const onChange = (event: SelectChangeEvent<string>): void => {
    setValue(event.target.value);
  }

  const getItems = (options: string[] | { [key: string]: string }) : React.ReactElement[] => {
    const content = [];
    for (const i in options) {
      // @ts-ignore
      content.push(<MenuItem value={i}>{options[i]}</MenuItem>);
    }
    return content;
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', paddingTop: '10px' }}>
        <Select onChange={onChange} value={value} style={{ flex: '1 0 auto' }}>
          {getItems(prompt?.options?.options || [])}
        </Select>
        <Button onClick={submit}>Confirm</Button>
      </div>
    </>
  );
}
