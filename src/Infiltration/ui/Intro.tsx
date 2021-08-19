import { IPlayer } from "../../PersonObjects/IPlayer";
import { IEngine } from "../../IEngine";
import React from 'react';
import { StdButton } from "../../ui/React/StdButton";
import Grid from '@material-ui/core/Grid';

interface IProps {
    Player: IPlayer;
    Engine: IEngine;
    Location: string;
    Difficulty: number;
    MaxLevel: number;
    start: () => void;
    cancel: () => void;
}

function arrowPart(color: string, length: number): JSX.Element {
    let arrow = "";
    if(length <= 0) length = 0;
    else if(length > 13) length = 13;
    else {
        length--;
        arrow = ">";
    }
    return <span style={{color: color}}>{"=".repeat(length)}{arrow}{" ".repeat(13-arrow.length-length)}</span>
}

function coloredArrow(difficulty: number): JSX.Element {
    if(difficulty === 0) {
        return <span style={{color: 'white'}}>{'>'}{" ".repeat(38)}</span>
    } else {
        return <>{arrowPart('white', difficulty*13)}{arrowPart('orange', (difficulty-1)*13)}{arrowPart('red', (difficulty-2)*13)}</>
    }
}

export function Intro(props: IProps): React.ReactElement {
    return (<>
        <Grid container spacing={3}>
            <Grid item xs={10}>
                <h1>Infiltrating {props.Location}</h1>
            </Grid>
            <Grid item xs={10}>
                <h2>Maximum level: {props.MaxLevel}</h2>
            </Grid>
            <Grid item xs={10}>
                
<pre>[{coloredArrow(props.Difficulty)}]</pre>
<pre> ^            ^            ^           ^</pre>
<pre> Trivial    Normal        Hard    Impossible</pre>
            </Grid>
            <Grid item xs={10}>
                <p>Infiltration is a series of short minigames that get
                progressively harder. You take damage for failing them. Reaching
                the maximum level rewards you with intel you can trade for money
                or reputation.</p>
                <br />
                <p>The minigames you play are randomly selected. It might take you
                few tries to get used to them.</p>
                <br />
                <p>No game require use of the mouse.</p>
                <br />
                <p>Spacebar is the default action/confirm button.</p>
                <br />
                <p>Everything that uses arrow can also use WASD</p>
                <br />
                <p>Sometimes the rest of the keyboard is used.</p>
            </Grid>
            <Grid item xs={3}>
                <StdButton onClick={props.start} text={"Start"} />
            </Grid>
            <Grid item xs={3}>
                <StdButton onClick={props.cancel} text={"Cancel"} />
            </Grid>
        </Grid>
    </>)
}