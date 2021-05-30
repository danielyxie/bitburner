import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { IMinigameProps } from "./IMinigameProps";
import { KeyHandler } from "./KeyHandler";
import { GameTimer } from "./GameTimer";

export function BribeGame(props: IMinigameProps) {
    const timer = 15000;
    const [choices, setChoices] = useState(makeChoices());
    const [index, setIndex] = useState(0);

    function press(event: React.KeyboardEvent<HTMLElement>) {
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
            <h1 className={"noselect"}>Be diplomatic!</h1>
            <KeyHandler onKeyDown={press} />
        </Grid>
        <Grid item xs={6}>
            <h1>Say something nice about the guard.</h1>
            <h2>↑</h2>
            <h2>{choices[index]}</h2>
            <h2>↓</h2>
        </Grid>
    </Grid>)
}

function shuffleArray(array: string[]) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function makeChoices(): string[] {
    const choices = [];
    choices.push(positive[Math.floor(Math.random()*positive.length)]);
    for(let i = 0; i < 8; i++) {
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