import { IPlayer } from "../../PersonObjects/IPlayer";
import { IEngine } from "../../IEngine";
import { Factions } from "../../Faction/Factions";
import React, { useState } from 'react';
import { StdButton } from "../../ui/React/StdButton";
import Grid from '@material-ui/core/Grid';
import { MuiPaper } from '../../ui/React/MuiPaper';
import NativeSelect from '@material-ui/core/NativeSelect';
import { Money } from "../../ui/React/Money";
import { Reputation } from "../../ui/React/Reputation";


interface IProps {
    Player: IPlayer;
    Engine: IEngine;
    StartingDifficulty: number;
    Difficulty: number;
    MaxLevel: number;
}

export function Victory(props: IProps) {
    const [faction, setFaction] = useState('none');

    function quitInfiltration() {
        const menu = document.getElementById("mainmenu-container");
        if(!menu) throw new Error('mainmenu-container somehow null');
        menu.style.visibility = "visible";
        props.Engine.loadLocationContent();
    }

    const repGain = Math.pow(props.Difficulty+1, 1.1)*
        Math.pow(props.StartingDifficulty, 1.2)*
        1e3;

    const moneyGain = Math.pow(props.Difficulty+1, 2)*
        Math.pow(props.StartingDifficulty, 3)*
        400e3;

    function sell() {
        props.Player.gainMoney(moneyGain);
        props.Player.recordMoneySource(moneyGain, 'infiltration');
        quitInfiltration();
    }

    function trade() {
        if(faction === 'none') return;
        Factions[faction].playerReputation += repGain;
        quitInfiltration();
    }

    function changeDropdown(event: React.ChangeEvent<HTMLSelectElement>) {
         setFaction(event.target.value);
    }

    return (<>
        <Grid container spacing={3}>
            <Grid item xs={10}>
                <h1>Infiltration successful!</h1>
            </Grid>
            <Grid item xs={10}>
                <h2>You can trade the confidential information you found for money or reputation.</h2>
                <select className={"dropdown"} onChange={changeDropdown}>
                    <option key={'none'} value={'none'}>{'none'}</option>
                    {props.Player.factions.filter(f => Factions[f].getInfo().offersWork()).map(f => <option key={f} value={f}>{f}</option>)}
                </select>
                <StdButton onClick={trade} text={<>{"Trade for "}{Reputation(repGain)}{" reputation"}</>} />
            </Grid>
            <Grid item xs={3}>
                <StdButton onClick={sell} text={<>{"Sell for "}{Money(moneyGain)}</>} />
            </Grid>
            <Grid item xs={3}>
                <StdButton onClick={quitInfiltration} text={"Quit"} />
            </Grid>
        </Grid>
    </>)
}