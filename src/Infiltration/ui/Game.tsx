import { IPlayer } from "../../PersonObjects/IPlayer";
import { IEngine } from "../../IEngine";
import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { Countdown } from "./Countdown";
import { DummyGame } from "./DummyGame";
import { BracketGame } from "./BracketGame";
import { SlashGame } from "./SlashGame";
import { BackwardGame } from "./BackwardGame";
import { BribeGame } from "./BribeGame";
import { Victory } from "./Victory";

interface IProps {
    Player: IPlayer;
    Engine: IEngine;
    Difficulty: number;
    MaxLevel: number;
}

enum Stage {
    Countdown = 0,
    Minigame,
    Result,
    Sell,
}

const minigames = [
    SlashGame,
    DummyGame,
    BracketGame,
    BackwardGame,
    BribeGame,
]

export function Game(props: IProps) {
    const [level, setLevel] = useState(1);
    const [stage, setStage] = useState(Stage.Countdown);

    function success() {
        if(level === props.MaxLevel) {
            setStage(Stage.Sell);
        } else {
            setStage(Stage.Countdown);
            setLevel(level+1);
        }
    }

    function failure() {
        setStage(Stage.Countdown);
        if(props.Player.takeDamage(10)) {
            const menu = document.getElementById("mainmenu-container");
            if(menu === null) throw new Error("mainmenu-container not found");
            menu.style.visibility = "visible";
            props.Engine.loadLocationContent();
        }
    }

    let stageComponent: React.ReactNode;
    switch(stage) {
    case Stage.Countdown:
        stageComponent = (<Countdown onFinish={() =>setStage(Stage.Minigame)} />);
        break;
    case Stage.Minigame:
        //const minigameId = Math.floor(Math.random()*minigames.length);
        const minigameId = 4+0;
        switch(minigameId) {
        case 0:
            stageComponent = (<SlashGame onSuccess={success} onFailure={failure} difficulty={5} />);
            break;
        case 1:
            stageComponent = (<DummyGame onSuccess={success} onFailure={failure} difficulty={5} />);
            break;
        case 2:
            stageComponent = (<BracketGame onSuccess={success} onFailure={failure} difficulty={5} />);
            break;
        case 3:
            stageComponent = (<BackwardGame onSuccess={success} onFailure={failure} difficulty={5} />);
            break;
        case 4:
            stageComponent = (<BribeGame onSuccess={success} onFailure={failure} difficulty={5} />);
            break;
        }
        break;
    case Stage.Sell:
        stageComponent = (<Victory Player={props.Player} Engine={props.Engine} />);
        break;
    }


    return (<>
        <Grid container spacing={3}>
            <Grid item xs={3}>
                <h3>Level: {level}&nbsp;/&nbsp;{props.MaxLevel}</h3>
            </Grid>

            <Grid item xs={12}>
                {stageComponent}
            </Grid>
        </Grid>
    </>)
}