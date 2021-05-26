import { IPlayer } from "../../PersonObjects/IPlayer";
import { IEngine } from "../../IEngine";
import { Factions } from "../../Faction/Factions";
import React, { useState } from 'react';
import { StdButton } from "../../ui/React/StdButton";
import Grid from '@material-ui/core/Grid';
import { MuiPaper } from '../../ui/React/MuiPaper';
import NativeSelect from '@material-ui/core/NativeSelect';


interface IProps {
    Player: IPlayer;
    Engine: IEngine;
}

export function Victory(props: IProps) {
    const [faction, setFaction] = useState('none');

    function quitInfiltration() {
        const menu = document.getElementById("mainmenu-container");
        if(!menu) throw new Error('mainmenu-container somehow null');
        menu.style.visibility = "visible";
        props.Engine.loadLocationContent();
    }

    function sell() {
        props.Player.gainMoney(1e9);
        props.Player.recordMoneySource(1e9, 'infiltration');
        quitInfiltration();
    }

    function trade() {
        Factions[faction].playerReputation += 1e4;
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
                <StdButton onClick={trade} text={"Trade for reputation"} />
            </Grid>
            <Grid item xs={3}>
                <StdButton onClick={sell} text={"Sell for money"} />
            </Grid>
            <Grid item xs={3}>
                <StdButton onClick={quitInfiltration} text={"Quit"} />
            </Grid>
        </Grid>
    </>)
}