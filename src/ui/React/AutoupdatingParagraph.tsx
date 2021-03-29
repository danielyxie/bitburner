/**
 * Basic paragraph (p Element) that automatically re-renders itself every X seconds
 *
 * NOT recommended for usage - only if you really have to
 */
import * as React from "react";

interface IProps {
    intervalTime?: number;
    style?: object;
    getContent: () => JSX.Element;
    getTooltip?: () => JSX.Element;
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
        let tooltip: JSX.Element | null;
        if (hasTooltip) {
            tooltip = this.props.getTooltip!();
            if (!tooltip) {
                hasTooltip = false;
            }
        }

        return (
            <p className="tooltip" style={this.props.style}>
                {this.props.getContent()}
                {
                    hasTooltip &&
                    <span className={"tooltiptext"}>{tooltip!}</span>
                }
            </p>
        )
    }
}
