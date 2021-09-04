/**
 * Stateless button that represents something that has been purchased.
 */
import * as React from "react";

interface IStdButtonPurchasedProps {
  onClick?: (e: React.MouseEvent<HTMLElement>) => any;
  style?: any;
  text: string;
  tooltip?: string;
}

type IInnerHTMLMarkup = {
  __html: string;
};

export class StdButtonPurchased extends React.Component<
  IStdButtonPurchasedProps,
  any
> {
  constructor(props: IStdButtonPurchasedProps) {
    super(props);
    this.hasTooltip = this.hasTooltip.bind(this);
    this.tooltip = this.tooltip.bind(this);
  }

  hasTooltip(): boolean {
    return this.props.tooltip != null && this.props.tooltip !== "";
  }

  tooltip(): string {
    if (!this.props.tooltip) return "";
    return this.props.tooltip;
  }

  render(): React.ReactNode {
    let className = "std-button-bought";
    if (this.hasTooltip()) {
      className += " tooltip";
    }

    // Tooltip will be set using inner HTML
    let tooltipMarkup: IInnerHTMLMarkup = {
      __html: "",
    };
    if (this.hasTooltip()) {
      tooltipMarkup = {
        __html: this.tooltip(),
      };
    }

    return (
      <button
        className={className}
        onClick={this.props.onClick}
        style={this.props.style}
      >
        {this.props.text}
        {this.hasTooltip() && (
          <span
            className={"tooltiptext"}
            dangerouslySetInnerHTML={tooltipMarkup}
          ></span>
        )}
      </button>
    );
  }
}
