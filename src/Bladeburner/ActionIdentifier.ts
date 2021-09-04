import { IActionIdentifier } from "./IActionIdentifier";
import {
  Generic_fromJSON,
  Generic_toJSON,
  Reviver,
} from "../../utils/JSONReviver";

interface IParams {
  name?: string;
  type?: number;
}

export class ActionIdentifier implements IActionIdentifier {
  name = "";
  type = -1;

  constructor(params: IParams = {}) {
    if (params.name) this.name = params.name;
    if (params.type) this.type = params.type;
  }

  toJSON(): any {
    return Generic_toJSON("ActionIdentifier", this);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static fromJSON(value: any): ActionIdentifier {
    return Generic_fromJSON(ActionIdentifier, value.data);
  }
}

Reviver.constructors.ActionIdentifier = ActionIdentifier;
