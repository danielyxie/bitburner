
import { BladeburnerConstants } from "./data/Constants";
import { getRandomInt } from "../../utils/helpers/getRandomInt";
import { Generic_fromJSON, Generic_toJSON, Reviver } from "../../utils/JSONReviver";
import { addOffset } from "../../utils/helpers/addOffset";

export class ChangePopulationByCountParams {
    estChange = 0;
    estOffset = 0;
}

export class ChangePopulationByPercentageParams {
    nonZero = false;
    changeEstEqually = false;
}

export class City {

    /**
     * Name of the city.
     */
    name = "";

    /**
     * Population of the city.
     */
    pop = 0;

    /**
     * Population estimation of the city.
     */
    popEst = 0;

    /**
     * Number of communities in the city.
     */
    comms = 0;

    /**
     * Estimated number of communities in the city.
     */
    commsEst = 0;

    /**
     * Chaos level of the city.
     */
    chaos = 0;

    constructor(name: string = BladeburnerConstants.CityNames[2]) {
        this.name = name;

        // Synthoid population and estimate
        this.pop    = getRandomInt(BladeburnerConstants.PopulationThreshold, 1.5 * BladeburnerConstants.PopulationThreshold);
        this.popEst = this.pop * (Math.random() + 0.5);

        // Number of Synthoid communities population and estimate
        this.comms          = getRandomInt(5, 150)
        this.commsEst       = this.comms + getRandomInt(-5, 5);
        if (this.commsEst < 0) this.commsEst = 0;
        this.chaos          = 0;
    }

    /**
     * p is the percentage, not the multiplier (e.g. pass in p = 5 for 5%)
     */
    changeChaosByPercentage(p: number): void {
        if (isNaN(p)) {throw new Error("NaN passed into City.chaosChaosByPercentage()");}
        if (p === 0) {return;}
        this.chaos += this.chaos * (p/100);
        if (this.chaos < 0) {this.chaos = 0;}
    }

    improvePopulationEstimateByCount(n: number): void {
        if (isNaN(n)) {throw new Error("NaN passeed into City.improvePopulationEstimateByCount()");}
        if (this.popEst < this.pop) {
            this.popEst += n;
            if (this.popEst > this.pop) {this.popEst = this.pop;}
        } else if (this.popEst > this.pop) {
            this.popEst -= n;
            if (this.popEst < this.pop) {this.popEst = this.pop;}
        }
    }

    /**
     * p is the percentage, not the multiplier (e.g. pass in p = 5 for 5%)
     */
    improvePopulationEstimateByPercentage(p: number, skillMult=1): void {
        p = p*skillMult;
        if (isNaN(p)) {throw new Error("NaN passed into City.improvePopulationEstimateByPercentage()");}
        if (this.popEst < this.pop) {
            ++this.popEst; // In case estimate is 0
            this.popEst *= (1 + (p/100));
            if (this.popEst > this.pop) {this.popEst = this.pop;}
        } else if (this.popEst > this.pop) {
            this.popEst *= (1 - (p/100));
            if (this.popEst < this.pop) {this.popEst = this.pop;}
        }
    }

    improveCommunityEstimate(n=1): void {
        if (isNaN(n)) {throw new Error("NaN passed into City.improveCommunityEstimate()");}
        if (this.commsEst < this.comms) {
            this.commsEst += n;
            if (this.commsEst > this.comms) {this.commsEst = this.comms;}
        } else if (this.commsEst > this.comms) {
            this.commsEst -= n;
            if (this.commsEst < this.comms) {this.commsEst = this.comms;}
        }
    }

    /**
     * @params options:
     *  estChange(int): How much the estimate should change by
     *  estOffset(int): Add offset to estimate (offset by percentage)
     */
    changePopulationByCount(n: number, params: ChangePopulationByCountParams=new ChangePopulationByCountParams()): void {
        if (isNaN(n)) {throw new Error("NaN passed into City.changePopulationByCount()");}
        this.pop += n;
        if (params.estChange && !isNaN(params.estChange)) {this.popEst += params.estChange;}
        if (params.estOffset) {
            this.popEst = addOffset(this.popEst, params.estOffset);
        }
        this.popEst = Math.max(this.popEst, 0);
    }

    /**
     * @p is the percentage, not the multiplier. e.g. pass in p = 5 for 5%
     * @params options:
     *  changeEstEqually(bool) - Change the population estimate by an equal amount
     *  nonZero (bool)         - Set to true to ensure that population always changes by at least 1
     */
    changePopulationByPercentage(p: number, params: ChangePopulationByPercentageParams=new ChangePopulationByPercentageParams()): number {
        if (isNaN(p)) {throw new Error("NaN passed into City.changePopulationByPercentage()");}
        if (p === 0) {return 0;}
        let change = Math.round(this.pop * (p/100));

        // Population always changes by at least 1
        if (params.nonZero && change === 0) {
            p > 0 ? change = 1 : change = -1;
        }

        this.pop += change;
        if (params.changeEstEqually) {
            this.popEst += change;
            if (this.popEst < 0) {this.popEst = 0;}
        }
        return change;
    }

    changeChaosByCount(n: number): void {
        if (isNaN(n)) {throw new Error("NaN passed into City.changeChaosByCount()");}
        if (n === 0) {return;}
        this.chaos += n;
        if (this.chaos < 0) {this.chaos = 0;}
    }

    /**
     * Initiatizes a City object from a JSON save state.
     */
    static fromJSON(value: any): City {
        return Generic_fromJSON(City, value.data);
    }

    /**
     * Serialize the current object to a JSON save state.
     */
    toJSON(): any {
        return Generic_toJSON("City", this);
    }
}

Reviver.constructors.City = City;
