/**
 * Text (p Element) with Tooltip
 */
import * as React from "react";

export interface IParagraphWithTooltipProps {
  style?: any;
  content: JSX.Element;
  tooltip: string | React.ReactElement | JSX.Element;
}

export class ParagraphWithTooltip extends React.Component<
  IParagraphWithTooltipProps,
  any
> {
  render(): React.ReactNode {
    return (
      <div className={"tooltip"} style={this.props.style}>
        <p>{this.props.content}</p>
        <span className={"tooltiptext"}>{this.props.tooltip}</span>
      </div>
    );
  }
}
