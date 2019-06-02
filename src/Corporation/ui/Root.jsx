// Root React Component for the Corporation UI
import React from "react";
import { BaseReactComponent } from "./BaseReactComponent";

import { HeaderTabs } from "./HeaderTabs";
import { MainPanel } from "./MainPanel";

export class CorporationRoot extends BaseReactComponent {
    render() {
        return (
            <div>
                <HeaderTabs {...this.props} />
                <MainPanel {...this.props} />
            </div>
        )
    }
}
