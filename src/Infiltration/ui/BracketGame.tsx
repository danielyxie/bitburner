import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { IMinigameProps } from "./IMinigameProps";
import { KeyHandler } from "./KeyHandler";
import { GameTimer } from "./GameTimer";
import { random } from "../utils";

import { Values } from "../debug";

function generateLeft(): string {
    let str = "";
    const length = random(Values.Bracket.min, Values.Bracket.max);
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

export function BracketGame(props: IMinigameProps) {
    const timer = Values.Bracket.timer;
    const [right, setRight] = useState("");
    const [left, setLeft] = useState(generateLeft());

    function press(event: React.KeyboardEvent<HTMLElement>) {
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
            <h1 className={"noselect"}>Match the brackets</h1>
            <p style={{fontSize: '5em'}}>{`${left}${right}`}</p>
            <KeyHandler onKeyDown={press} />
        </Grid>
    </Grid>)
}