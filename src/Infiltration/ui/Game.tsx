import { IPlayer } from "../../PersonObjects/IPlayer";
import { IEngine } from "../../IEngine";
import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { Countdown } from "./Countdown";
import { BracketGame } from "./BracketGame";
import { SlashGame } from "./SlashGame";
import { BackwardGame } from "./BackwardGame";
import { BribeGame } from "./BribeGame";
import { CheatCodeGame } from "./CheatCodeGame";
import { Cyberpunk2077Game } from "./Cyberpunk2077Game";
import { MinesweeperGame } from "./MinesweeperGame";
import { WireCuttingGame } from "./WireCuttingGame";
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
    BracketGame,
    BackwardGame,
    BribeGame,
    CheatCodeGame,
    Cyberpunk2077Game,
    MinesweeperGame,
    WireCuttingGame,
]

export function Game(props: IProps) {
    const [level, setLevel] = useState(1);
    const [stage, setStage] = useState(Stage.Countdown);
    const [results, setResults] = useState('');

    function success(): void {
        pushResult(true);
        if(level === props.MaxLevel) {
            setStage(Stage.Sell);
        } else {
            setStage(Stage.Countdown);
            setLevel(level+1);
        }
    }

    function pushResult(win: boolean): void {
        setResults(old => {
            let next = old;
            next += win? "✓" : "✗";
            if(next.length > 15) next = next.slice(1);
            return next;
        })
    }

    function failure(): void {
        setStage(Stage.Countdown);
        pushResult(false);
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
        //const MiniGame = minigames[Math.floor(Math.random()*minigames.length)];
        const MiniGame = minigames[7];
        stageComponent = (<MiniGame onSuccess={success} onFailure={failure} difficulty={5} />);
        break;
    case Stage.Sell:
        stageComponent = (<Victory Player={props.Player} Engine={props.Engine} />);
        break;
    }


    return (<>
        <Grid container spacing={3}>
            <Grid item xs={3}>
                <h3>Level: {level}&nbsp;/&nbsp;{props.MaxLevel}</h3>
                <h4>{results}</h4>
            </Grid>

            <Grid item xs={12}>
                {stageComponent}
            </Grid>
        </Grid>
    </>)
}