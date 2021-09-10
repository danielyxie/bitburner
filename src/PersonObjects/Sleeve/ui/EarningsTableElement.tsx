import * as React from "react";

interface IProps {
  title: string;
  stats: any[][];
}

export function EarningsTableElement(props: IProps): React.ReactElement {
  return (
    <>
      <pre>{props.title}</pre>
      <table>
        <tbody>
          {props.stats.map((stat: any[], i: number) => (
            <tr key={i}>
              {stat.map((s: any, i: number) => {
                let style = {};
                if (i !== 0) {
                  style = { textAlign: "right" };
                }
                return (
                  <td style={style} key={i}>
                    {s}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
