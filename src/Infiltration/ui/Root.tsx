import { IPlayer } from "../../PersonObjects/IPlayer";
import { IEngine } from "../../IEngine";
import React, { useState } from 'react';
import { StdButton } from "../../ui/React/StdButton";
import Grid from '@material-ui/core/Grid';
import { MuiPaper } from '../../ui/React/MuiPaper';
import { Intro } from "./Intro";
import { Game } from "./Game";

interface IProps {
    Player: IPlayer;
    Engine: IEngine;
    Location: string;
    Difficulty: number;
    MaxLevel: number;
}

export function Root(props: IProps) {
    const [start, setStart] = useState(false);

    function cancel() {
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
        Difficulty={props.Difficulty}
        MaxLevel={props.MaxLevel}
    />);
}