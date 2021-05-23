import { IPlayer } from "../../PersonObjects/IPlayer";
import { IEngine } from "../../IEngine";
import * as React from "react";
import { StdButton } from "../../ui/React/StdButton";
import Grid from '@material-ui/core/Grid';
import { MuiPaper } from '../../ui/React/MuiPaper';

interface IProps {
    Player: IPlayer;
    Engine: IEngine;
    Location: string;
    Difficulty: number;
    MaxLevel: number;
    start: () => void;
    cancel: () => void;
}

export function Intro(props: IProps) {
    return (<>
        <Grid container spacing={3}>
            <Grid item xs={10}>
                <h1>Infiltrating {props.Location}</h1>
            </Grid>
            <Grid item xs={10}>
                <h2>Difficulty: {props.Difficulty}, Maximum level: {props.MaxLevel}</h2>
            </Grid>
            <Grid item xs={10}>
                <p>Infiltration is a series of short minigames that get progressively harder. You take damage for failing them. Reaching a deep enough level will rewards you with intel that you can sell or trade for reputation.</p>
                <br />
                <p>They will never require the use of your mouse. spacebar is the most used action, followed by arrows/wasd, and sometimes the rest of your keys.</p>
            </Grid>
            <Grid item xs={3}>
                <StdButton onClick={props.start} text={"Start"} />
            </Grid>
            <Grid item xs={3}>
                <StdButton onClick={props.cancel} text={"Cancel"} />
            </Grid>
        </Grid>
    </>)
}