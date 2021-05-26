import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { IMinigameProps } from "./IMinigameProps";
import { KeyHandler } from "./KeyHandler";
import { GameTimer } from "./GameTimer";


export function SlashGame(props: IMinigameProps) {
    const timer = 2000;
    const [guarding, setGuarding] = useState(true);

    function press(event: React.KeyboardEvent<HTMLElement>) {
        if(event.keyCode !== 32) return;
        if(guarding) {
            props.onFailure();
        } else {
            props.onSuccess();
        }
    }

    useEffect(() => {
        let id2 = -1;
        const id = setTimeout(() => {
            setGuarding(false);
            id2 = setTimeout(()=>setGuarding(true), Math.random()*250+250)
        }, Math.random()*1000+500);
        return () => {
            clearInterval(id);
            if(id2 !== -1) clearInterval(id2);
        }
    }, []);

    return (<Grid container spacing={3}>
        <GameTimer millis={timer} onExpire={props.onFailure} />
        <Grid item xs={12}>
            <h1 className={"noselect"}>Slash when his guard is down!</h1>
            <p style={{fontSize: '5em'}}>{guarding ? "!Guarding!" : "!ATTACKING!"}</p>
            <KeyHandler onKeyDown={press} />
        </Grid>
    </Grid>)
}