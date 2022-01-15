import React, { ErrorInfo } from "react";
import { RecoveryRoot } from "./React/RecoveryRoot";
import { IRouter } from "./Router";

interface IProps {
  router: IRouter;
  softReset: () => void;
}


export class ErrorBoundary extends React.Component<IProps> {
  state: { hasError: boolean }
  constructor(props: IProps) {
    super(props);
    this.state = { hasError: false };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(error, errorInfo);
  }
  render(): React.ReactNode {
    if (this.state.hasError) {
      return <RecoveryRoot router={this.props.router} softReset={this.props.softReset} />;
    }
    return this.props.children;
  }
  static getDerivedStateFromError(): { hasError: true} {
    return { hasError: true };
  }
}