import React, { useState } from 'react';
import { Config } from "./Config";
import { StdButton } from "../../ui/React/StdButton";
import { removePopup } from "../../ui/React/createPopup";

interface IProps {
    id: string;
    config: Config;
    save: (config: Config) => void;
}

export function ConfigPopup(props: IProps): React.ReactElement {
    const [config, setConfig] = useState<Config>(props.config);
    function save() {
        props.save(config);
        removePopup(props.id);
    }

    function setTheme(event: React.ChangeEvent<HTMLSelectElement>): void {
        setConfig(old => {
            old.theme = event.target.value;
            return old;
        });
    }

    return (<>
        <select className="dropdown" onChange={setTheme} defaultValue={config.theme}>
            <option value="vs-dark">vs-dark</option>
            <option value="light">light</option>
        </select>
        <br />
        <StdButton text={"Save"} onClick={save} />
    </>);
}