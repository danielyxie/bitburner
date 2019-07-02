/**
 * React Component for a simple Error Boundary. The fallback UI for
 * this error boundary is simply a bordered text box
 */
import * as React from "react";

import { EventEmitter } from "../../utils/EventEmitter";

type IProps = {
    eventEmitterForReset?: EventEmitter;
    id?: string;
};

type IState = {
    errorInfo: string;
    hasError: boolean;
}

type IErrorInfo = {
    componentStack: string;
}

// TODO: Move this out to a css file
const styleMarkup = {
    border: "1px solid red",
    display: "inline-block",
    margin: "4px",
    padding: "4px",
}

export class ErrorBoundary extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            errorInfo: "",
            hasError: false,
        }
    }

    static getDerivedStateFromError(error: Error) {
        return {
            errorInfo: error.message,
            hasError: true,
        };
    }

    componentDidCatch(error: Error, info: IErrorInfo) {
        console.error(`Caught error in React ErrorBoundary. Component stack:`);
        console.error(info.componentStack);
    }

    componentDidMount() {
        const cb = () => {
            this.setState({
                hasError: false,
            });
        }

        if (this.hasEventEmitter()) {
            this.props.eventEmitterForReset!.addSubscriber({
                cb: cb,
                id: this.props.id!,
            });
        }
    }

    componentWillUnmount() {
        if (this.hasEventEmitter()) {
            this.props.eventEmitterForReset!.removeSubscriber(this.props.id!);
        }
    }

    hasEventEmitter(): boolean {
        return this.props.eventEmitterForReset instanceof EventEmitter
                && typeof this.props.id === "string";
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={styleMarkup}>
                    <p>
                        {
                            `Error rendering UI. This is (probably) a bug. Please report to game developer.`
                        }
                    </p>
                    <p>
                        {
                            `In the meantime, try refreshing the game WITHOUT saving.`
                        }
                    </p>
                    <p>
                        {
                            `Error info: ${this.state.errorInfo}`
                        }
                    </p>
                </div>
            )
        }

        return this.props.children;
    }
}
