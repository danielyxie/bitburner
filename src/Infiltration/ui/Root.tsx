import { IPlayer } from "../../PersonObjects/IPlayer";
import { IEngine } from "../../IEngine";
import React, { useState } from 'react';
import { Intro } from "./Intro";
import { Game } from "./Game";

interface IProps {
    Player: IPlayer;
    Engine: IEngine;
    Location: string;
    StartingDifficulty: number;
    Difficulty: number;
    MaxLevel: number;
}

export function Root(props: IProps): React.ReactElement {
    const [start, setStart] = useState(false);

    function cancel(): void {
        const menu = document.getElementById("mainmenu-container");
        if(menu === null) throw new Error("mainmenu-container not found");
        menu.style.visibility = "visible";
        props.Engine.loadLocationContent();
    }

    if(!start) {
        return (<Intro
            Player={props.Player}
            Engine={props.Engine}
            Location={props.Location}
            Difficulty={props.Difficulty}
            MaxLevel={props.MaxLevel}
            start={() => setStart(true)}
            cancel={cancel}
        />)
    }

    return (<Game
        Player={props.Player}
        Engine={props.Engine}
        StartingDifficulty={props.StartingDifficulty}
        Difficulty={props.Difficulty}
        MaxLevel={props.MaxLevel}
    />);
}