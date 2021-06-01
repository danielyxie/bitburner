import { IPlayer } from "../../PersonObjects/IPlayer";
import { IEngine } from "../../IEngine";
import React, { useState, useEffect } from 'react';
import { StdButton } from "../../ui/React/StdButton";
import Grid from '@material-ui/core/Grid';
import { MuiPaper } from '../../ui/React/MuiPaper';
import { Values } from "../debug";

interface IProps {
    Player: IPlayer;
    Engine: IEngine;
    Location: string;
    Difficulty: number;
    MaxLevel: number;
    start: () => void;
    cancel: () => void;
}

interface VProps {
    label: string;
    onChange: (v: number) => void;
    initial: number;
}

function Value(props: VProps) {
    const [value, setValue] = useState(props.initial);
    return (
        <>{props.label} <input className="dropdown" onChange={(event) => {
            const v = parseFloat(event.target.value);
            props.onChange(v);
            setValue(v);
        }} value={value}></input><br /></>
    )
}

export function Intro(props: IProps) {
    return (<>
        <Grid container spacing={3}>
            <Grid item xs={10}>
                <h1>Infiltrating {props.Location}</h1>
            </Grid>
            <Grid item xs={10}>
                <h2>Difficulty: {props.Difficulty}, Maximum level: {props.MaxLevel}</h2>
            </Grid>
            <Grid item xs={10}>
                <p>Infiltration is a series of short minigames that get progressively harder. You take damage for failing them. Reaching a deep enough level will rewards you with intel that you can sell or trade for reputation.</p>
                <br />
                <p>They will never require the use of your mouse. spacebar is the most used action, followed by arrows/wasd, and sometimes the rest of your keys.</p>
            </Grid>
            <Grid item xs={3}>
                <StdButton onClick={props.start} text={"Start"} />
            </Grid>
            <Grid item xs={3}>
                <StdButton onClick={props.cancel} text={"Cancel"} />
            </Grid>
            <Grid item xs={12}>
                DEBUG
            </Grid>
            <Grid item xs={12}>
                Which game?
                <select className="dropdown" onChange={(event) => Values.GameId = parseInt(event.target.value)}>
                    <option value="0">SlashGame</option>
                    <option value="1">BracketGame</option>
                    <option value="2">BackwardGame</option>
                    <option value="3">BribeGame</option>
                    <option value="4">CheatCodeGame</option>
                    <option value="5">Cyberpunk2077Game</option>
                    <option value="6">MinesweeperGame</option>
                    <option value="7">WireCuttingGame</option>
                </select>
            </Grid>
            <Grid item xs={3}>
                <Value label={"Slash time"} initial={Values.Slash.timer}  onChange={v => Values.Slash.timer=v} />
                <Value label={"Slash opening min"} initial={Values.Slash.min}  onChange={v => Values.Slash.min=v} />
                <Value label={"Slash opening max"} initial={Values.Slash.max}  onChange={v => Values.Slash.max=v} />
            </Grid>
            <Grid item xs={3}>
                <Value label={"Bracket time"} initial={Values.Bracket.timer}  onChange={v => Values.Bracket.timer=v} />
                <Value label={"Bracket size min"} initial={Values.Bracket.min}  onChange={v => Values.Bracket.min=v} />
                <Value label={"Bracket size max"} initial={Values.Bracket.max}  onChange={v => Values.Bracket.max=v} />
            </Grid>
            <Grid item xs={3}>
                <Value label={"Backward time"} initial={Values.Backward.timer}  onChange={v => Values.Backward.timer=v} />
                <Value label={"Backward size min"} initial={Values.Backward.min}  onChange={v => Values.Backward.min=v} />
                <Value label={"Backward size max"} initial={Values.Backward.max}  onChange={v => Values.Backward.max=v} />
            </Grid>
            <Grid item xs={3}>
                <Value label={"Bribe time"} initial={Values.Bribe.timer}  onChange={v => Values.Bribe.timer=v} />
                <Value label={"Bribe size"} initial={Values.Bribe.options}  onChange={v => Values.Bribe.options=v} />
            </Grid>
            <Grid item xs={3}>
                <Value label={"CheatCode time"} initial={Values.CheatCode.timer}  onChange={v => Values.CheatCode.timer=v} />
                <Value label={"CheatCode size min"} initial={Values.CheatCode.min}  onChange={v => Values.CheatCode.min=v} />
                <Value label={"CheatCode size max"} initial={Values.CheatCode.max}  onChange={v => Values.CheatCode.max=v} />
            </Grid>
            <Grid item xs={3}>
                <Value label={"Cyberpunk time"} initial={Values.Cyberpunk.timer}  onChange={v => Values.Cyberpunk.timer=v} />
                <Value label={"Cyberpunk size min"} initial={Values.Cyberpunk.min}  onChange={v => Values.Cyberpunk.min=v} />
                <Value label={"Cyberpunk size max"} initial={Values.Cyberpunk.max}  onChange={v => Values.Cyberpunk.max=v} />
            </Grid>
            <Grid item xs={3}>
                <Value label={"Minesweeper time"} initial={Values.Minesweeper.timer}  onChange={v => Values.Minesweeper.timer=v} />
                <Value label={"Minesweeper width"} initial={Values.Minesweeper.width}  onChange={v => Values.Minesweeper.width=v} />
                <Value label={"Minesweeper height"} initial={Values.Minesweeper.height}  onChange={v => Values.Minesweeper.height=v} />
                <Value label={"Minesweeper mine min"} initial={Values.Minesweeper.minemin}  onChange={v => Values.Minesweeper.minemin=v} />
                <Value label={"Minesweeper mine max"} initial={Values.Minesweeper.minemax}  onChange={v => Values.Minesweeper.minemax=v} />
            </Grid>
            <Grid item xs={3}>
                <Value label={"WireCuttingGame time"} initial={Values.WireCutting.timer}  onChange={v => Values.WireCutting.timer=v} />
                <Value label={"WireCuttingGame wire min"} initial={Values.WireCutting.wiresmin}  onChange={v => Values.WireCutting.wiresmin=v} />
                <Value label={"WireCuttingGame wire max"} initial={Values.WireCutting.wiresmax}  onChange={v => Values.WireCutting.wiresmax=v} />
                <Value label={"WireCuttingGame rules"} initial={Values.WireCutting.rules}  onChange={v => Values.WireCutting.rules=v} />
            </Grid>
        </Grid>
    </>)
}