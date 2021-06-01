import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { IMinigameProps } from "./IMinigameProps";
import { KeyHandler } from "./KeyHandler";
import { GameTimer } from "./GameTimer";
import { random } from "../utils";

import { Values } from "../debug";

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

export function MinesweeperGame(props: IMinigameProps) {
    const timer = Values.Minesweeper.timer;
    const [minefield] = useState(generateMinefield());
    const [answer, setAnswer] = useState(generateEmptyField());
    const [pos, setPos] = useState([0, 0]);
    const [memoryPhase, setMemoryPhase] = useState(true);

    function press(event: React.KeyboardEvent<HTMLElement>) {
        event.preventDefault();
        if(memoryPhase) return;
        const move = [0, 0];
        const arrow = getArrow(event);
        switch(arrow) {
        case "↑":
            move[1]--;
            break;
        case "←":
            move[0]--;
            break;
        case "↓":
            move[1]++;
            break;
        case "→":
            move[0]++;
            break;
        }
        const next = [pos[0]+move[0], pos[1]+move[1]];
        next[0] = (next[0]+minefield[0].length)%minefield[0].length;
        next[1] = (next[1]+minefield.length)%minefield.length;
        setPos(next);

        if(event.keyCode == 32) {
            if(!minefield[pos[1]][pos[0]]) {
                props.onFailure();
                return;
            }
            setAnswer(old => {
                old[pos[1]][pos[0]] = true;
                if(fieldEquals(minefield, old)) props.onSuccess();
                return old;
            });
        }
    }

    useEffect(() => {
        const id = setTimeout(() => setMemoryPhase(false), 2000);
        return () => clearInterval(id);
    }, []);

    return (<Grid container spacing={3}>
        <GameTimer millis={timer} onExpire={props.onFailure} />
        <Grid item xs={12}>
            <h1 className={"noselect"}>{memoryPhase?"Remember all the mines!": "Mark all the mines!"}</h1>
            {minefield.map((line, y) => <div key={y}><pre>{line.map((cell, x) => {
                if(memoryPhase) {
                    if(minefield[y][x])
                        return <span key={x}>[?]&nbsp;</span>
                    return <span key={x}>[&nbsp;]&nbsp;</span>
                } else {
                    if(x == pos[0] && y == pos[1])
                        return <span key={x}>[X]&nbsp;</span>
                    if(answer[y][x])
                        return <span key={x}>[.]&nbsp;</span>
                    return <span key={x}>[&nbsp;]&nbsp;</span>
                }
            })}</pre><br /></div>)}
            <KeyHandler onKeyDown={press} />
        </Grid>
    </Grid>)
}

function fieldEquals(a: boolean[][], b: boolean[][]): boolean {
    function count(field: boolean[][]): number {
        return field.flat().reduce((a, b) => a + (b?1:0), 0);
    }
    return count(a) === count(b);
}

function generateEmptyField(): boolean[][] {
    const field = [];
    for(let i = 0; i < Values.Minesweeper.height; i++) {
        field.push((new Array(Values.Minesweeper.width)).fill(false));
    }
    return field;
}

function generateMinefield(): boolean[][] {
    const field = generateEmptyField();
    for(let i = 0; i < random(Values.Minesweeper.minemin, Values.Minesweeper.minemax); i++) {
        field[Math.floor(Math.random()*field.length)][Math.floor(Math.random()*field[0].length)] = true;
    }
    return field;
}
