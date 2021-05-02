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

    componentDidCatch(error: Error, info: IErrorInfo): void {
        console.error(`Caught error in React ErrorBoundary. Component stack:`);
        console.error(info.componentStack);
    }

    componentDidMount(): void {
        const cb = (): void => {
            this.setState({
                hasError: false,
            });
        }

        if (this.hasEventEmitter()) {
            (this.props.eventEmitterForReset as EventEmitter).addSubscriber({
                cb: cb,
                id: (this.props.id as string),
            });
        }
    }

    componentWillUnmount(): void {
        if (this.hasEventEmitter()) {
            (this.props.eventEmitterForReset as EventEmitter).removeSubscriber((this.props.id as string));
        }
    }

    hasEventEmitter(): boolean {
        return this.props.eventEmitterForReset != null && 
                this.props.eventEmitterForReset instanceof EventEmitter &&
                this.props.id != null && 
                typeof this.props.id === "string";
    }

    render(): React.ReactNode {
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

    static getDerivedStateFromError(error: Error): IState {
        return {
            errorInfo: error.message,
            hasError: true,
        };
    }
}
