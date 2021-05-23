import { IPlayer } from "../../PersonObjects/IPlayer";
import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { Countdown } from "./Countdown";
import { DummyGame } from "./DummyGame";

interface IProps {
    Player: IPlayer;
    Difficulty: number;
    MaxLevel: number;
}

enum Stage {
    Countdown = 0,
    Minigame,
    Result,
    Sell,
}

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
            console.log('you dead son');
        }
    }

    let stageComponent: React.ReactNode;
    switch(stage) {
    case Stage.Countdown:
        stageComponent = <Countdown key={Stage.Countdown} onFinish={() =>setStage(Stage.Minigame)} />
        break;
    case Stage.Minigame:
        stageComponent = <DummyGame key={Stage.Minigame} onSuccess={success} onFailure={failure} difficulty={5} />
        break;
    case Stage.Sell:
        stageComponent = <Countdown key={Stage.Sell} onFinish={() =>setStage(Stage.Countdown)} />
        break;
    }


    return (<>
        <Grid container spacing={3}>
            <Grid item xs={3}>
                <h3>Level: {level} / {props.MaxLevel}</h3>
            </Grid>

            <Grid item xs={12}>
                {stageComponent}
            </Grid>
        </Grid>
    </>)
}