import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { IMinigameProps } from "./IMinigameProps";
import { KeyHandler } from "./KeyHandler";
import { GameTimer } from "./GameTimer";
/*

| full
. dotted
/ slashed (stripped)
- dashed
  solid (empty)
# pound wire

colors

*/

const types = [
    "|",
    ".",
    "/",
    "-",
    "█",
    "#",
]

const colors = [
    "red",
    "#FFC107",
    "blue",
    "white",
]

interface Wire {
    tpe: string;
    colors: string[];
}

interface Question {
    toString: () => string;
    shouldCut: (wire: Wire, index: number) => boolean;
}

export function WireCuttingGame(props: IMinigameProps) {
    const timer = 20000;
    const [wires] = useState(generateWires());
    const [cutWires, setCutWires] = useState((new Array(wires.length)).fill(false));
    const [questions] = useState(generateQuestion(wires));

    function press(event: React.KeyboardEvent<HTMLElement>) {
        event.preventDefault();
        const wireNum = parseInt(event.key);
        
        if(wireNum < 1 || wireNum > wires.length || isNaN(wireNum)) return;
        setCutWires(old => {
            const next = [...old];
            next[wireNum-1] = true;
            if(!questions.some((q => q.shouldCut(wires[wireNum-1], wireNum-1)))) {
                props.onFailure();
            }

            // check if we won
            const wiresToBeCut = [];
            for(let j = 0; j < wires.length; j++) {
                let shouldBeCut = false;
                for(let i = 0; i < questions.length; i++) {    
                    shouldBeCut = shouldBeCut || questions[i].shouldCut(wires[j], j)
                }
                wiresToBeCut.push(shouldBeCut);
            }
            if(wiresToBeCut.every((b, i) => b === next[i])) {
                props.onSuccess();
            }

            return next;
        });
    }

    return (<Grid container spacing={3}>
        <GameTimer millis={timer} onExpire={props.onFailure} />
        <Grid item xs={12}>
            <h1 className={"noselect"}>Cut the wires with the following properties!</h1>
            {questions.map((question, i) => <h3 key={i}>{question.toString()}</h3>)}
            <pre>{(new Array(wires.length)).fill(0).map((_, i) => <span key={i}>&nbsp;{i+1}&nbsp;&nbsp;&nbsp;&nbsp;</span>)}</pre>
            {(new Array(8)).fill(0).map((_, i) => <div key={i}>
                <pre>
                {wires.map((wire, j) => {
                    if((i === 3 || i === 4) && cutWires[j]) return <span key={j}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>;
                    return <span key={j} style={{color: wire.colors[i%wire.colors.length]}}>|{wire.tpe}|&nbsp;&nbsp;&nbsp;</span>
                })}
                </pre>
            </div>)}
            <KeyHandler onKeyDown={press} />
        </Grid>
    </Grid>)
}

function randomPositionQuestion(wires: Wire[]) {
    const index = Math.floor(Math.random() * wires.length);
    return {
        toString: (): string => {
            return `Cut wires number ${index+1}.`;
        },
        shouldCut: (wire: Wire, i: number): boolean => {
            return index === i;
        }
    }
}

function randomColorQuestion(wires: Wire[]) {
    const index = Math.floor(Math.random() * wires.length);
    const cutColor = wires[index].colors[0];
    return {
        toString: (): string => {
            return `Cut all wires colored ${cutColor}.`; // todo, the array is a length
        },
        shouldCut: (wire: Wire, i: number):boolean => {
            return wire.colors.includes(cutColor);
        }
    }
}

function generateQuestion(wires: Wire[]): Question[] {
    const numQuestions = Math.random()*2+1;
    const questionGenerators = [
        randomPositionQuestion,
        randomColorQuestion,
    ]
    const questions = [];
    for(let i = 0; i < numQuestions; i++) {
        questions.push(questionGenerators[i%2](wires));
    }
    return questions;
}

function generateWires(): Wire[] {
    const wires = [];
    const numWires = Math.random()*3+6
    for(let i = 0; i < numWires; i++) {
        const wireColors = [colors[Math.floor(Math.random()*colors.length)]];
        if(Math.random() < 0.15) {
            wireColors.push(colors[Math.floor(Math.random()*colors.length)]);
        }
        wires.push({
            tpe: types[Math.floor(Math.random()*types.length)],
            colors: wireColors,
        });
    }
    return wires;
}