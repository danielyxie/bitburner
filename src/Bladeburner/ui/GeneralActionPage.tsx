import * as React from "react";
import { GeneralActionList } from "./GeneralActionList";

interface IProps {
    bladeburner: any;
}

export function GeneralActionPage(props: IProps): React.ReactElement {
    return (<>
        <p style={{display: 'block', margin: '4px', padding: '4px'}}>
            These are generic actions that will assist you in your Bladeburner 
            duties. They will not affect your Bladeburner rank in any way.
        </p>
        <GeneralActionList bladeburner={props.bladeburner} />
    </>);
}