import React from "react";
import { Reviver, Generic_toJSON, Generic_fromJSON, IReviverValue } from "../utils/JSONReviver";
import { IPlayer } from "src/PersonObjects/IPlayer";
import { Work, WorkType } from "./Work";
import { influenceStockThroughCompanyWork } from "../StockMarket/PlayerInfluencing";
import { LocationName } from "../Locations/data/LocationNames";
import { calculateCompanyWorkStats } from "./formulas/Company";
import { Companies } from "../Company/Companies";
import { applyWorkStats, WorkStats } from "./WorkStats";
import { Company } from "../Company/Company";
import { dialogBoxCreate } from "../ui/React/DialogBox";
import { Reputation } from "../ui/React/Reputation";

interface CompanyWorkParams {
  companyName: string;
  singularity: boolean;
}

export const isCompanyWork = (w: Work | null): w is CompanyWork => w !== null && w.type === WorkType.COMPANY;

export class CompanyWork extends Work {
  companyName: string;
  constructor(params?: CompanyWorkParams) {
    super(WorkType.COMPANY, params?.singularity ?? false);
    this.companyName = params?.companyName ?? LocationName.NewTokyoNoodleBar;
    console.log(Companies);
  }

  getCompany(): Company {
    const c = Companies[this.companyName];
    if (!c) throw new Error(`Company not found: '${this.companyName}'`);
    return c;
  }

  getGainRates(player: IPlayer): WorkStats {
    return calculateCompanyWorkStats(player, this.getCompany());
  }

  process(player: IPlayer, cycles: number): boolean {
    this.cyclesWorked += cycles;
    const company = this.getCompany();
    const gains = this.getGainRates(player);
    applyWorkStats(player, gains, cycles, "work");
    company.playerReputation += gains.reputation * cycles;
    influenceStockThroughCompanyWork(company, gains.reputation, cycles);
    return false;
  }
  finish(): void {
    dialogBoxCreate(
      <>
        You finished working for {this.companyName}
        <br />
        You have <Reputation reputation={this.getCompany().playerReputation} /> reputation with them.
      </>,
    );
  }

  /**
   * Serialize the current object to a JSON save state.
   */
  toJSON(): IReviverValue {
    return Generic_toJSON("CompanyWork", this);
  }

  /**
   * Initiatizes a CompanyWork object from a JSON save state.
   */
  static fromJSON(value: IReviverValue): CompanyWork {
    return Generic_fromJSON(CompanyWork, value.data);
  }
}

Reviver.constructors.CompanyWork = CompanyWork;
