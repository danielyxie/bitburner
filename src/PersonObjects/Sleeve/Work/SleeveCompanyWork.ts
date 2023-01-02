import { Generic_fromJSON, Generic_toJSON, IReviverValue, Reviver } from "../../../utils/JSONReviver";
import { Sleeve } from "../Sleeve";
import { applySleeveGains, Work, WorkType } from "./Work";
import { LocationName } from "../../../Enums";
import { Companies } from "../../../Company/Companies";
import { Company } from "../../../Company/Company";
import { calculateCompanyWorkStats } from "../../../Work/Formulas";
import { scaleWorkStats, WorkStats } from "../../../Work/WorkStats";
import { influenceStockThroughCompanyWork } from "../../../StockMarket/PlayerInfluencing";
import { Player } from "@player";
import { CompanyPositions } from "../../../Company/CompanyPositions";

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
    const company = this.getCompany();
    return scaleWorkStats(
      calculateCompanyWorkStats(sleeve, company, CompanyPositions[Player.jobs[company.name]], company.favor),
      sleeve.shockBonus(),
      false,
    );
  }

  process(sleeve: Sleeve, cycles: number) {
    const company = this.getCompany();
    const gains = this.getGainRates(sleeve);
    applySleeveGains(sleeve, gains, cycles);
    company.playerReputation += gains.reputation * cycles;
    influenceStockThroughCompanyWork(company, gains.reputation, cycles);
  }

  APICopy() {
    return {
      type: WorkType.COMPANY as "COMPANY",
      companyName: this.companyName,
    };
  }

  /** Serialize the current object to a JSON save state. */
  toJSON(): IReviverValue {
    return Generic_toJSON("SleeveCompanyWork", this);
  }

  /** Initializes a CompanyWork object from a JSON save state. */
  static fromJSON(value: IReviverValue): SleeveCompanyWork {
    return Generic_fromJSON(SleeveCompanyWork, value.data);
  }
}

Reviver.constructors.SleeveCompanyWork = SleeveCompanyWork;
