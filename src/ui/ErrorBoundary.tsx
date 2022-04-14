import React from "react";
import type { ErrorInfo } from "react";

import { getErrorForDisplay } from "../utils/ErrorHelper";
import type { IErrorData } from "../utils/ErrorHelper";

import { RecoveryRoot } from "./React/RecoveryRoot";
import type { IRouter, Page } from "./Router";

interface IProps {
  router: IRouter;
  softReset: () => void;
}

interface IState {
  error?: Error;
  errorInfo?: React.ErrorInfo;
  page?: Page;
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<IProps, IState> {
  state: IState;

  constructor(props: IProps) {
    super(props);
    this.state = { hasError: false } as IState;
  }

  reset(): void {
    this.setState({ hasError: false } as IState);
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      errorInfo,
      page: this.props.router.page(),
    });
    console.error(error, errorInfo);
  }
  render(): React.ReactNode {
    if (this.state.hasError) {
      let errorData: IErrorData | undefined;
      if (this.state.error) {
        try {
          // We don't want recursive errors, so in case this fails, it's in a try catch.
          errorData = getErrorForDisplay(this.state.error, this.state.errorInfo, this.state.page);
        } catch (ex) {
          console.error(ex);
        }
      }

      return (
        <RecoveryRoot
          router={this.props.router}
          softReset={this.props.softReset}
          errorData={errorData}
          resetError={() => this.reset()}
        />
      );
    }
    return this.props.children;
  }
  static getDerivedStateFromError(error: Error): IState {
    return { hasError: true, error };
  }
}
