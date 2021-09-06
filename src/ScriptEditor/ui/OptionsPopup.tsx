import React, { useState } from "react";
import { Options } from "./Options";
import { StdButton } from "../../ui/React/StdButton";
import { removePopup } from "../../ui/React/createPopup";

interface IProps {
  id: string;
  options: Options;
  save: (options: Options) => void;
}

export function OptionsPopup(props: IProps): React.ReactElement {
  const [theme, setTheme] = useState(props.options.theme);
  const [insertSpaces, setInsertSpaces] = useState(props.options.insertSpaces);

  function save(): void {
    props.save({
      theme: theme,
      insertSpaces: insertSpaces,
    });
    removePopup(props.id);
  }

  return (
    <div className="editor-options-container noselect">
      <div className="editor-options-line">
        <p>Theme: </p>
        <select
          className="dropdown"
          onChange={(event) => setTheme(event.target.value)}
          defaultValue={theme}
        >
          <option value="vs-dark">vs-dark</option>
          <option value="light">light</option>
        </select>
      </div>
      <div className="editor-options-line">
        <p>Use whitespace over tabs: </p>
        <input
          type="checkbox"
          onChange={(event) => setInsertSpaces(event.target.checked)}
          checked={insertSpaces}
        />
      </div>
      <br />
      <StdButton style={{ width: "50px" }} text={"Save"} onClick={save} />
    </div>
  );
}
