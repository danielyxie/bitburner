import React, { useState } from 'react';
import { Options } from "./Options";
import { StdButton } from "../../ui/React/StdButton";
import { removePopup } from "../../ui/React/createPopup";

interface IProps {
    id: string;
    options: Options;
    save: (options: Options) => void;
}

export function OptionsPopup(props: IProps): React.ReactElement {
    const [options, setOptions] = useState<Options>(props.options);
    function save() {
        props.save(options);
        removePopup(props.id);
    }

    function setTheme(event: React.ChangeEvent<HTMLSelectElement>): void {
        setOptions(old => {
            old.theme = event.target.value;
            return old;
        });
    }

    return (<>
        <p>Theme</p>
        <select className="dropdown" onChange={setTheme} defaultValue={options.theme}>
            <option value="vs-dark">vs-dark</option>
            <option value="light">light</option>
        </select>
        <br />
        <StdButton text={"Save"} onClick={save} />
    </>);
}