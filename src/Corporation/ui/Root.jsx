// Root React Component for the Corporation UI
import React from "react";
import { BaseReactComponent } from "./BaseReactComponent";

import { HeaderTabs } from "./HeaderTabs";
import { MainPanel } from "./MainPanel";

export class CorporationRoot extends BaseReactComponent {
    render() {
        return (
            <div>
                <HeaderTabs corp={this.props.corp} eventHandler={this.props.eventHandler} routing={this.props.routing} />
                <MainPanel {...this.props} />
            </div>
        )
    }
}
