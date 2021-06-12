import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { IMinigameProps } from "./IMinigameProps";
import { KeyHandler } from "./KeyHandler";
import { GameTimer } from "./GameTimer";
import { random } from "../utils";
import { interpolate } from "./Difficulty";
import { BlinkingCursor } from "./BlinkingCursor";

interface Difficulty {
    [key: string]: number;
    timer: number;
    min: number;
    max: number;
}

const difficulties: {
    Trivial: Difficulty;
    Normal: Difficulty;
    Hard: Difficulty;
    Impossible: Difficulty;
} = {
    Trivial: {timer:8000, min: 2, max: 3},
    Normal: {timer:6000, min: 4, max: 5},
    Hard: {timer:4000, min: 4, max: 6},
    Impossible: {timer: 2500, min: 7, max: 7},
}

function generateLeft(difficulty: Difficulty): string {
    let str = "";
    const length = random(difficulty.min, difficulty.max);
    for(let i = 0; i < length; i++) {
        str += ["[", '<', '(', '{'][Math.floor(Math.random()*4)];
    }

    return str;
}

function getChar(event: React.KeyboardEvent<HTMLElement>): string {
    if(event.keyCode == 48 && event.shiftKey) return ")";
    if(event.keyCode == 221 && !event.shiftKey) return "]";
    if(event.keyCode == 221 && event.shiftKey) return "}";
    if(event.keyCode == 190 && event.shiftKey) return ">";
    return "";
}

function match(left: string, right: string): boolean {
    return (left === '[' && right === ']') ||
        (left === '<' && right === '>') ||
        (left === '(' && right === ')') ||
        (left === '{' && right === '}');
}

export function BracketGame(props: IMinigameProps): React.ReactElement {
    const difficulty: Difficulty = {timer:0, min: 0, max: 0};
    interpolate(difficulties, props.difficulty, difficulty);
    const timer = difficulty.timer;
    const [right, setRight] = useState("");
    const [left] = useState(generateLeft(difficulty));

    function press(event: React.KeyboardEvent<HTMLElement>): void {
        event.preventDefault();
        const char = getChar(event);
        if(!char) return;
        if(!match(left[left.length-right.length-1], char)) {
            props.onFailure();
            return;
        }
        if(left.length === right.length+1) {
            props.onSuccess();
            return;
        }
        setRight(old => {
            return old+char;
        })
    }

    return (<Grid container spacing={3}>
        <GameTimer millis={timer} onExpire={props.onFailure} />
        <Grid item xs={12}>
            <h1 className={"noselect"}>Close the brackets</h1>
            <p style={{fontSize: '5em'}}>{`${left}${right}`}<BlinkingCursor /></p>
            <KeyHandler onKeyDown={press} />
        </Grid>
    </Grid>)
}