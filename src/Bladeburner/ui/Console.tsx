import React, { useState, useRef, useEffect } from "react";

interface ILineProps {
    content: any;
}

function Line(props: ILineProps): React.ReactElement {
    return (<tr>
        <td className="bladeburner-console-line" style={{color: 'var(--my-font-color)', whiteSpace: 'pre-wrap'}}>{props.content}</td>
    </tr>)
}

interface IProps {
    bladeburner: any;
}

export function Console(props: IProps): React.ReactElement {
    const lastRef = useRef<HTMLTableDataCellElement>(null);
    const setRerender = useState(false)[1];

    useEffect(() => {
        if(lastRef.current)
            lastRef.current.scrollIntoView({block: "end", inline: "nearest", behavior: "smooth" });
        const id = setInterval(() => setRerender(old => !old), 1000);
        return () => clearInterval(id);
    }, []);

    return (<table className="bladeburner-console-table">
        <tbody>
            {/*
                TODO: optimize this.
                using `i` as a key here isn't great because it'll re-render everything
                everytime the console reaches max length.
            */}
            {props.bladeburner.consoleLogs.map((log: any, i: number) => <Line key={i} content={log} />)}
            <tr key='input' id="bladeburner-console-input-row" className="bladeburner-console-input-row">
                <td ref={lastRef} className="bladeburner-console-input-cell">
                    <pre>{"> "}</pre><input autoFocus className="bladeburner-console-input" tabIndex={1} type="text" />
                </td>
            </tr>
        </tbody>
    </table>);
}