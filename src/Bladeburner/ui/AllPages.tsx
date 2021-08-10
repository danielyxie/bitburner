import React, { useState, useEffect } from "react";
import { GeneralActionPage } from "./GeneralActionPage";
import { ContractPage } from "./ContractPage";
import { OperationPage } from "./OperationPage";
import { BlackOpPage } from "./BlackOpPage";
import { SkillPage } from "./SkillPage";
import { stealthIcon, killIcon } from "../data/Icons";

interface IProps {
    bladeburner: any;
}

export function AllPages(props: IProps): React.ReactElement {
    const [page, setPage] = useState('General');
    const setRerender = useState(false)[1];

    useEffect(() => {
        const id = setInterval(() => setRerender(old => !old), 1000);
        return () => clearInterval(id);
    }, []);

    function Header(props: {name: string}): React.ReactElement {
        return (<a
                onClick={()=>setPage(props.name)}
                className={page !== props.name ?
                    "bladeburner-nav-button" :
                    "bladeburner-nav-button-inactive"}>
            {props.name}
        </a>);
    }
    return (<>
        <Header name={'General'} />
        <Header name={'Contracts'} />
        <Header name={'Operations'} />
        <Header name={'BlackOps'} />
        <Header name={'Skills'} />
        <div style={{display:"block", margin:"4px", padding:"4px"}}>
            {page === 'General' && <GeneralActionPage bladeburner={props.bladeburner} />}
            {page === 'Contracts' && <ContractPage bladeburner={props.bladeburner} />}
            {page === 'Operations' && <OperationPage bladeburner={props.bladeburner} />}
            {page === 'BlackOps' && <BlackOpPage bladeburner={props.bladeburner} />}
            {page === 'Skills' && <SkillPage bladeburner={props.bladeburner} />}
        </div>
        <span className="text">{stealthIcon}= This action requires stealth, {killIcon} = This action involves retirement</span>
    </>);
}