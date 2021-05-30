import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { IMinigameProps } from "./IMinigameProps";
import { KeyHandler } from "./KeyHandler";
import { GameTimer } from "./GameTimer";

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
    const timer = 15000;
    const [code, _] = useState(generateCode());
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

function generateCode(): string {
    const arrows = ['←', '→', '↑', '↓'];
    let code = '';
    for(let i = 0; i < 10; i++) {
        let arrow = arrows[Math.floor(4*Math.random())];
        while(arrow === code[code.length-1]) arrow = arrows[Math.floor(4*Math.random())];
        code += arrow;
    }

    return code;
}
