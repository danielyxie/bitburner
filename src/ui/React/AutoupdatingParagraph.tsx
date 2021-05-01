/**
 * Basic paragraph (p Element) that automatically re-renders itself every X seconds
 *
 * NOT recommended for usage - only if you really have to
 */
import * as React from "react";

interface IProps {
    intervalTime?: number;
    style?: any;
    getContent: () => JSX.Element;
    getTooltip?: () => JSX.Element;
}

interface IState {
    i: number;
}

export class AutoupdatingParagraph extends React.Component<IProps, IState> {
    /**
     *  Timer ID for auto-updating implementation (returned value from setInterval())
     */
    interval = 0;

    constructor(props: IProps) {
        super(props);
        this.state = {
            i: 0,
        }
    }

    componentDidMount(): void {
        const time = this.props.intervalTime ? this.props.intervalTime : 1000;
        this.interval = setInterval(() => this.tick(), time);
    }

    componentWillUnmount(): void {
        clearInterval(this.interval);
    }

    tick(): void {
        this.setState(prevState => ({
            i: prevState.i + 1,
        }));
    }

    hasTooltip(): boolean {
        if (this.props.getTooltip != null) {
            return !!this.props.getTooltip()
        }
        return true;
    }

    tooltip(): JSX.Element {
        if(!this.props.getTooltip) return <></>;
        return this.props.getTooltip();
    }

    render(): React.ReactNode {
        return (
            <p className="tooltip" style={this.props.style}>
                {this.props.getContent()}
                {
                    this.hasTooltip() &&
                    <span className={"tooltiptext"}>{this.tooltip()}</span>
                }
            </p>
        )
    }
}
