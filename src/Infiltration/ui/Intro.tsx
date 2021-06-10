import { IPlayer } from "../../PersonObjects/IPlayer";
import { IEngine } from "../../IEngine";
import React, { useState, useEffect } from 'react';
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

function diffStr(d: number): string {
    if(d<=0.5) return "trivial";
    if(d<=1.5) return "normal";
    if(d<=2.5) return "hard";
    return "impossible";
}

export function Intro(props: IProps) {
    return (<>
        <Grid container spacing={3}>
            <Grid item xs={10}>
                <h1>Infiltrating {props.Location}</h1>
            </Grid>
            <Grid item xs={10}>
                <h2>Difficulty: {diffStr(props.Difficulty)}, Maximum level: {props.MaxLevel}</h2>
            </Grid>
            <Grid item xs={10}>
                <p>Infiltration is a series of short minigames that get
                progressively harder. You take damage for failing them. Reaching
                the maximum level rewards you with intel you can trade for money
                or reputation.</p>
                <br />
                <p>No game require use of the mouse</p>
                <br />
                <p>Spacebar is the default action/confirm button.</p>
                <br />
                <p>Everything that uses arrow can also use WASD</p>
                <br />
                <p>Sometimes the rest of the keyboard is used.</p>
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