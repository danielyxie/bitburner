// Base class for React Components for Corporation UI
// Contains a few helper functions that let derived classes easily
// access Corporation properties
import React from "react";

const Component = React.Component;

export class BaseReactComponent extends Component {
    corp() {
        return this.props.corp;
    }

    eventHandler() {
        return this.props.eventHandler;
    }

    routing() {
        return this.props.routing;
    }

    render() {}
}
