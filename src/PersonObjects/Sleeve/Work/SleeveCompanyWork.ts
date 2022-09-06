import { IPlayer } from "../../IPlayer";
import { Generic_fromJSON, Generic_toJSON, IReviverValue, Reviver } from "../../../utils/JSONReviver";
import { Sleeve } from "../Sleeve";
import { applySleeveGains, Work, WorkType } from "./Work";
import { LocationName } from "../../../Locations/data/LocationNames";
import { Companies } from "../../../Company/Companies";
import { Company } from "../../../Company/Company";
import { calculateCompanyWorkStats } from "../../../Work/formulas/Company";
import { WorkStats } from "../../../Work/WorkStats";
import { influenceStockThroughCompanyWork } from "../../../StockMarket/PlayerInfluencing";

interface SleeveCompanyWorkParams {
  companyName: string;
}

export const isSleeveCompanyWork = (w: Work | null): w is SleeveCompanyWork =>
  w !== null && w.type === WorkType.COMPANY;

export class SleeveCompanyWork extends Work {
  companyName: string;

  constructor(params?: SleeveCompanyWorkParams) {
    super(WorkType.COMPANY);
    this.companyName = params?.companyName ?? LocationName.NewTokyoNoodleBar;
  }

  getCompany(): Company {
    const c = Companies[this.companyName];
    if (!c) throw new Error(`Company not found: '${this.companyName}'`);
    return c;
  }

  getGainRates(sleeve: Sleeve): WorkStats {
    return calculateCompanyWorkStats(sleeve, this.getCompany());
  }

  process(sleeve: Sleeve, cycles: number): number {
    const company = this.getCompany();
    const gains = this.getGainRates(sleeve);
    applySleeveGains(sleeve, gains, cycles);
    company.playerReputation += gains.reputation * cycles;
    influenceStockThroughCompanyWork(company, gains.reputation, cycles);
    return 0;
  }

  APICopy(): Record<string, unknown> {
    return {
      type: this.type,
      companyName: this.companyName,
    };
  }

  /**
   * Serialize the current object to a JSON save state.
   */
  toJSON(): IReviverValue {
    return Generic_toJSON("SleeveCompanyWork", this);
  }

  /**
   * Initiatizes a CompanyWork object from a JSON save state.
   */
  static fromJSON(value: IReviverValue): SleeveCompanyWork {
    return Generic_fromJSON(SleeveCompanyWork, value.data);
  }
}

Reviver.constructors.SleeveCompanyWork = SleeveCompanyWork;
