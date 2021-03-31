/**
 * Text (p Element) with Tooltip
 */
import * as React       from "react";

export interface IParagraphWithTooltipProps {
    style?: object;
    content: JSX.Element;
    tooltip: string;
}

export class ParagraphWithTooltip extends React.Component<IParagraphWithTooltipProps, any> {
    render() {
        return (
            <p className={"tooltip"} style={this.props.style}>
                {this.props.content}
                <span className={"tooltiptext"}>
                    {this.props.tooltip}
                </span>
            </p>
        )
    }
}
