/**
 * React Component for displaying a single Source-File as an accordion.
 *
 * The header of the accordion contains the Source-Files's name and level,
 * and the accordion's panel contains the Source-File's description.
 */
import * as React from "react";

import { Accordion } from "./Accordion";

import { SourceFile } from "../../SourceFile/SourceFile";

type IProps = {
    level: number,
    sf: SourceFile,
}

export function SourceFileAccordion(props: IProps): React.ReactElement {
    const maxLevel = props.sf.n === 3 ? "∞" : "3";

    return (
        <Accordion
            headerContent={
                <>
                    {props.sf.name}
                    <br />
                    {`Level ${props.level} / ${maxLevel}`}
                </>
            }
            panelContent={
                <p dangerouslySetInnerHTML={{__html: props.sf.info}}></p>
            }
        />
    )
}
