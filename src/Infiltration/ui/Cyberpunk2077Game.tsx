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

export function Cyberpunk2077Game(props: IMinigameProps) {
    const timer = 15000;
    const [grid] = useState(generatePuzzle());
    const [answer] = useState(generateAnswer(grid));
    const [index, setIndex] = useState(0);
    const [pos, setPos] = useState([0, 0]);

    function press(event: React.KeyboardEvent<HTMLElement>) {
        event.preventDefault();
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
        next[0] = (next[0]+grid[0].length)%grid[0].length;
        next[1] = (next[1]+grid.length)%grid.length;
        setPos(next);

        if(event.keyCode == 32) {
            const selected = grid[pos[1]][pos[0]];
            const expected = answer[index];
            if(selected !== expected) {
                props.onFailure();
                return;
            }
            setIndex(index+1);
            if(answer.length === index+1) props.onSuccess();
        }

        // 32
    }

    return (<Grid container spacing={3}>
        <GameTimer millis={timer} onExpire={props.onFailure} />
        <Grid item xs={12}>
            <h1 className={"noselect"}>Match the symbols!</h1>
            <h2>Target:{answer.map((a, i) => {
                if(i == index)
                    return <span style={{color: 'blue'}}>{a}&nbsp;</span>
                return <span>{a}&nbsp;</span>
            })}</h2>
            <br />
            {grid.map((line, y) => <><pre>{line.map((cell, x) => {
                if(x == pos[0] && y == pos[1])
                    return <span style={{color: 'blue'}}>{cell}&nbsp;</span>
                return <span>{cell}&nbsp;</span>
            })}</pre><br /></>)}
            <KeyHandler onKeyDown={press} />
        </Grid>
    </Grid>)
}

function generateAnswer(grid: string[][]): string[] {
    const answer = [];
    const size = Math.random()*3+4;
    for(let i = 0; i < size; i++) {
        answer.push(grid[Math.floor(Math.random()*grid.length)][Math.floor(Math.random()*grid[0].length)]);
    }
    return answer;
}

function randChar(): string {
    return "ABCDEF0123456789"[Math.floor(Math.random()*16)];
}

function generatePuzzle(): string[][] {
    const puzzle = [];
    for(let i = 0; i < 5; i++) {
        const line = [];
        for(let j = 0; j < 5; j++) {
            line.push(randChar()+randChar());
        }
        puzzle.push(line);
    }
    return puzzle;
}
