// React Components for the Corporation UI's navigation tabs
// These are the tabs at the top of the UI that let you switch to different
// divisions, see an overview of your corporation, or create a new industry
import React from "react";
import { BaseReactComponent } from "./BaseReactComponent";
import { HeaderTab } from "./HeaderTab";

export class HeaderTabs extends BaseReactComponent {
    renderTab(props) {
        return (
            <HeaderTab
                current={props.current}
                key={props.key}
                onClick={props.onClick}
                text={props.text}
            />
        )
    }

    render() {
        const overviewOnClick = () => {
            this.routing().routeToOverviewPage();
            this.corp().rerender();
        }

        const divisionOnClicks = {};
        for (const division of this.corp().divisions) {
            const name = division.name;
            const onClick = () => {
                this.routing().routeTo(name);
                this.corp().rerender();
            }

            divisionOnClicks[name] = onClick;
        }

        return (
            <div>
                {
                    this.renderTab({
                        current: this.routing().isOnOverviewPage(),
                        key: "overview",
                        onClick: overviewOnClick,
                        text: this.corp().name,
                    })
                }
                {
                    this.corp().divisions.map((division) => {
                        return this.renderTab({
                            current: this.routing().isOn(division.name),
                            key: division.name,
                            onClick: divisionOnClicks[division.name],
                            text: division.name,
                        });
                    })
                }
                {
                    this.renderTab({
                        onClick: this.eventHandler().createNewIndustryPopup.bind(this.eventHandler()),
                        text: "Expand into new Industry",
                    })
                }
            </div>
        )
    }
}
