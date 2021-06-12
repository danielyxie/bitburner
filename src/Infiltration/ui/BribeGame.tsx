import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { IMinigameProps } from "./IMinigameProps";
import { KeyHandler } from "./KeyHandler";
import { GameTimer } from "./GameTimer";
import { interpolate } from "./Difficulty";

interface Difficulty {
    [key: string]: number;
    timer: number;
    size: number;
}

const difficulties: {
    Trivial: Difficulty;
    Normal: Difficulty;
    Hard: Difficulty;
    Impossible: Difficulty;
} = {
    Trivial: {timer: 12000, size: 6},
    Normal: {timer: 9000, size: 8},
    Hard: {timer: 5000, size: 9},
    Impossible: {timer: 2500, size: 12},
}

export function BribeGame(props: IMinigameProps): React.ReactElement {
    const difficulty: Difficulty = {timer: 0, size: 0};
    interpolate(difficulties, props.difficulty, difficulty);
    const timer = difficulty.timer;
    const [choices] = useState(makeChoices(difficulty));
    const [index, setIndex] = useState(0);

    function press(event: React.KeyboardEvent<HTMLElement>): void {
        event.preventDefault();
        const k = event.keyCode;
        if(k === 32) {
            if(positive.includes(choices[index])) props.onSuccess();
            else props.onFailure();
            return;
        }

        let newIndex = index;
        if([38, 87, 68, 39].includes(k)) newIndex++;
        if([65, 37, 83, 40].includes(k)) newIndex--;
        while(newIndex < 0) newIndex += choices.length;
        while(newIndex > choices.length-1) newIndex -= choices.length;
        setIndex(newIndex);
    }

    return (<Grid container spacing={3}>
        <GameTimer millis={timer} onExpire={props.onFailure} />
        <Grid item xs={12}>
            <h1>Say something nice about the guard.</h1>
            <KeyHandler onKeyDown={press} />
        </Grid>
        <Grid item xs={6}>
            <h2 style={{fontSize: "2em"}}>↑</h2>
            <h2 style={{fontSize: "2em"}}>{choices[index]}</h2>
            <h2 style={{fontSize: "2em"}}>↓</h2>
        </Grid>
    </Grid>)
}

function shuffleArray(array: string[]): void {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function makeChoices(difficulty: Difficulty): string[] {
    const choices = [];
    choices.push(positive[Math.floor(Math.random()*positive.length)]);
    for(let i = 0; i < difficulty.size; i++) {
        const option = negative[Math.floor(Math.random()*negative.length)];
        if(choices.includes(option)) {
            i--;
            continue;
        }
        choices.push(option);
    }
    shuffleArray(choices);
    return choices;
}

const positive = ["affectionate","agreeable","bright","charming","creative",
    "determined","energetic","friendly","funny","generous","polite","likable",
    "diplomatic","helpful","giving","kind","hardworking","patient","dynamic",
    "loyal"];

const negative = ["aggressive","aloof","arrogant","big-headed","boastful",
    "boring","bossy","careless","clingy","couch potato","cruel","cynical",
    "grumpy","hot air","know it all","obnoxious","pain in the neck","picky",
    "tactless","thoughtless"];