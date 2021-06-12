import * as React from "react";
import {
    Fragments,
    Fragment,
    NoneFragment,
    DeleteFragment,
} from "../Fragment";
import { FragmentType } from "../FragmentType";
import { IStaneksGift } from "../IStaneksGift";
import { G } from "./G";
import { numeralWrapper } from "../../ui/numeralFormat";

import List from '@material-ui/core/List';
import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';


type IOptionProps = {
    gift: IStaneksGift;
    fragment: Fragment;
    selectFragment: (fragment: Fragment) => void;
}

function FragmentOption(props: IOptionProps) {
    const remaining = props.fragment.limit !== Infinity ? (<>{props.fragment.limit - props.gift.count(props.fragment)} remaining</>) : (<></>);
    return (<>
        <ListItem button onClick={()=>props.selectFragment(props.fragment)} style={{backgroundColor: '#222'}}>
            <p style={{marginBottom: '1em'}}>
                {FragmentType[props.fragment.type]}<br />
                power: {numeralWrapper.formatStaneksGiftPower(props.fragment.power)}<br />
                {remaining}
            </p><br />
            <G width={props.fragment.width()}
                height={props.fragment.height()}
                colorAt={(x, y) => props.fragment.fullAt(x, y) ? "green" : ""} />
        </ListItem>
        <Divider />
    </>)
}

type IProps = {
    gift: IStaneksGift;
    selectFragment: (fragment: Fragment) => void;
}

export function FragmentSelector(props: IProps) {
    return (<List style={{maxHeight: '250px', overflow: 'auto'}}>
        <ListItem button onClick={()=>props.selectFragment(NoneFragment)} style={{backgroundColor: '#222'}}>
            <p style={{marginBottom: '1em'}}>
                None
            </p>
        </ListItem><Divider />
        <ListItem button onClick={()=>props.selectFragment(DeleteFragment)} style={{backgroundColor: '#222'}}>
            <p style={{marginBottom: '1em'}}>
                Delete
            </p>
        </ListItem><Divider />
        {Fragments.map(fragment => <FragmentOption
            key={fragment.id}
            gift={props.gift}
            selectFragment={props.selectFragment}
            fragment={fragment}
        />)}
    </List>)
}

