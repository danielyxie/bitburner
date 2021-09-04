/**
 * Basic stateless button
 * Uses the 'std-button' css class
 */
import * as React from "react";

interface IStdButtonProps {
  addClasses?: string;
  disabled?: boolean;
  id?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => any;
  style?: any;
  text: string | JSX.Element;
  tooltip?: string | JSX.Element;
}

type IInnerHTMLMarkup = {
  __html: string;
};

export function StdButton(props: IStdButtonProps): React.ReactElement {
  const hasTooltip = props.tooltip != null && props.tooltip !== "";
  let className = props.disabled ? "std-button-disabled" : "std-button";
  if (hasTooltip) {
    className += " tooltip";
  }

  if (typeof props.addClasses === "string") {
    className += ` ${props.addClasses}`;
  }

  // Tooltip will be set using inner HTML
  let tooltip;
  if (hasTooltip) {
    if (typeof props.tooltip === "string") {
      const tooltipMarkup: IInnerHTMLMarkup = {
        __html: props.tooltip,
      };
      tooltip = (
        <span
          className={"tooltiptext"}
          dangerouslySetInnerHTML={tooltipMarkup}
        ></span>
      );
    } else {
      tooltip = <span className={"tooltiptext"}>{props.tooltip}</span>;
    }
  }

  return (
    <button
      className={className}
      id={props.id}
      onClick={props.onClick}
      style={props.style}
    >
      {props.text}
      {hasTooltip && tooltip}
    </button>
  );
}
