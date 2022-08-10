import React from "react";

interface baubleState {
  connection: boolean;
  callback: () => boolean;
}

interface baubleProps {
  callback: () => boolean;
}

export class ConnectionBauble extends React.Component<baubleProps> {
  timerID: NodeJS.Timer;
  state: baubleState;

  constructor(props: baubleProps) {
    super(props);
    this.state = {
      connection: props.callback(),
      callback: props.callback,
    };
  }

  componentDidMount(): void {
    this.timerID = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount(): void {
    clearInterval(this.timerID);
  }

  tick(): void {
    this.setState({
      connection: this.state.callback(),
    });
  }

  render(): string {
    return this.state.connection ? "Connected" : "Disconnected";
  }
}
