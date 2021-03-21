import * as React from "react";

export function StatsTable(rows: any[][], title: string | null): React.ReactElement {
    let titleElem = <></>
    if (title) {
        titleElem = <><h2><u>{title}</u></h2><br /></>;
    }
    return (<>
        {titleElem}
        <table>
            <tbody>
                {rows.map((row: any[]) => {
                    return <tr key={row[0]}>
                        {row.map((elem: any, i: number) => {
                            let style = {};
                            if (i !== 0) style = {textAlign: 'right', paddingLeft: '.25em'};
                            return <td key={i} style={style}>{elem}</td>
                        })}
                    </tr>
                })}
            </tbody>
        </table>
    </>);
}