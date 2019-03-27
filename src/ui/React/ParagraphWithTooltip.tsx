/**
 * Text (p Element) with Tooltip
 */
import * as React       from "react";

export interface IParagraphWithTooltipProps {
    style?: object;
    text: string;
    tooltip: string;
}

export class ParagraphWithTooltip extends React.Component<IParagraphWithTooltipProps, any> {
    render() {
        return (
            <p className={"tooltip"}>
                {this.props.text}
                <span className={"tooltiptext"}>
                    {this.props.tooltip}
                </span>
            </p>
        )
    }
}
