/**
 * Basic paragraph (p Element) that automatically re-renders itself every X seconds
 *
 * NOT recommended for usage - only if you really have to
 */
import * as React from "react";

interface IProps {
    intervalTime?: number;
    style?: object;
    getText: () => string;
    getTooltip?: () => string;
}

interface IState {
    i: number;
}

type IInnerHTMLMarkup = {
    __html: string;
}

export class AutoupdatingParagraph extends React.Component<IProps, IState> {
    /**
     *  Timer ID for auto-updating implementation (returned value from setInterval())
     */
    interval: number = 0;

    constructor(props: IProps) {
        super(props);
        this.state = {
            i: 0,
        }
    }

    componentDidMount() {
        const time = this.props.intervalTime ? this.props.intervalTime : 1000;
        this.interval = setInterval(() => this.tick(), time);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    tick() {
        this.setState(prevState => ({
            i: prevState.i + 1
        }));
    }

    render() {
        let hasTooltip = this.props.getTooltip != null;
        let tooltip: string | null;
        if (hasTooltip) {
            tooltip = this.props.getTooltip!();
            if (tooltip === "") {
                hasTooltip = false;
            }
        }

        const className = "tooltip";

        // Tooltip will be set using inner HTML
        let tooltipMarkup: IInnerHTMLMarkup | null;
        if (hasTooltip) {
            tooltipMarkup = {
                __html: tooltip!
            }
        }

        return (
            <p className={className} style={this.props.style}>
                {this.props.getText()}
                {
                    hasTooltip &&
                    <span className={"tooltiptext"} dangerouslySetInnerHTML={tooltipMarkup!}></span>
                }
            </p>
        )
    }
}
