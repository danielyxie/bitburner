import * as React from "react";

export function EarningsTableElement(title: string, stats: any[][]): React.ReactElement {
    return (<>
        {title}
        <table>
            <tbody>
                {stats.map((stat: any[], i: number) => <tr key={i}>
                    {stat.map((s: any, i: number) => {
                        let style = {};
                        if(i !== 0) {
                            style = {textAlign: "right"};
                        }
                        return <td style={style} key={i}>{s}</td>
                    })}
                </tr>)}
            </tbody>
        </table>
    </>)
}
