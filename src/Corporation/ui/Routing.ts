import { IMap } from "../../types";

export const overviewPage: string = "Overview";

// Interfaces for whatever's required to sanitize routing with Corporation Data
interface IOfficeSpace {

}

interface IDivision {
    name: string;
    offices: IMap<IOfficeSpace>
}

interface ICorporation {
    divisions: IDivision[];
}

/**
 * Keeps track of what content is currently being displayed for the Corporation UI
 */
export class CorporationRouting {
    private currentPage: string = overviewPage;

    // Stores a reference to the Corporation instance
    private corp: ICorporation;

    // Stores a reference to the Division instance that the routing is currently on
    // This will be null if routing is on the overview page
    currentDivision: IDivision | null = null;

    constructor(corp: ICorporation) {
        this.corp = corp;
    }

    current(): string {
        return this.currentPage;
    }

    /**
     * Checks that the specified page has a valid value
     */
    isValidPage(page: string): boolean {
        if (page === overviewPage) { return true; }

        for (const division of this.corp.divisions) {
            if (division.name === page) { return true; }
        }

        return false;
    }

    /**
     * Returns a boolean indicating whether or not the player is on the given page
     */
    isOn(page: string): boolean {
        if (!this.isValidPage(page)) { return false; }

        return page === this.currentPage;
    }

    isOnOverviewPage(): boolean {
        return this.currentPage === overviewPage;
    }

    /**
     * Routes to the specified page
     */
    routeTo(page: string): void {
        if (!this.isValidPage(page)) { return; }


        this.currentDivision = null;
        if (page !== overviewPage) {
            // Iterate through Corporation data to get a reference to the current division
            for (let i = 0; i < this.corp.divisions.length; ++i) {
                if (this.corp.divisions[i].name === page) {
                    this.currentDivision = this.corp.divisions[i];
                };
            }

            // 'currentDivision' should not be null, since the routing is either on
            // the overview page or a division page
            if (this.currentDivision == null) {
                console.warn(`Routing could not find division ${page}`);
            }
        }

        this.currentPage = page;
    }

    routeToOverviewPage(): void {
        this.currentPage = overviewPage;
        this.currentDivision = null;
    }
}
