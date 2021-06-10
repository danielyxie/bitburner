import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { IMinigameProps } from "./IMinigameProps";
import { KeyHandler } from "./KeyHandler";
import { GameTimer } from "./GameTimer";
import { random } from "../utils";
import { interpolate } from "./Difficulty";

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
    Trivial: {timer: 13000, min: 6, max: 8},
    Normal: {timer: 7000, min: 7, max: 8},
    Hard: {timer: 5000, min: 8, max: 9},
    Impossible: {timer: 3000, min: 9, max: 9},
}

function getArrow(event: React.KeyboardEvent<HTMLElement>): string {
    switch(event.keyCode) {
    case 38:
    case 87:
        return "↑";
    case 65:
    case 37:
        return "←";
    case 40:
    case 83:
        return "↓";
    case 39:
    case 68:
        return "→";
    }
    return '';
}

export function CheatCodeGame(props: IMinigameProps) {
    const difficulty: Difficulty = {timer: 0, min: 0, max: 0};
    interpolate(difficulties, props.difficulty, difficulty);
    const timer = difficulty.timer;
    const [code, _] = useState(generateCode(difficulty));
    const [index, setIndex] = useState(0);

    function press(event: React.KeyboardEvent<HTMLElement>) {
        if(code[index] !== getArrow(event)) {
            props.onFailure();
            return;
        }
        setIndex(index+1);
        if(index+1 >= code.length) props.onSuccess();
        event.preventDefault();
    }

    return (<Grid container spacing={3}>
        <GameTimer millis={timer} onExpire={props.onFailure} />
        <Grid item xs={12}>
            <h1 className={"noselect"}>Enter the Code!</h1>
            <p style={{fontSize: '50px'}}>{code[index]}</p>
            <KeyHandler onKeyDown={press} />
        </Grid>
    </Grid>)
}

function generateCode(difficulty: Difficulty): string {
    const arrows = ['←', '→', '↑', '↓'];
    let code = '';
    for(let i = 0; i < random(difficulty.min, difficulty.max); i++) {
        let arrow = arrows[Math.floor(4*Math.random())];
        while(arrow === code[code.length-1]) arrow = arrows[Math.floor(4*Math.random())];
        code += arrow;
    }

    return code;
}
