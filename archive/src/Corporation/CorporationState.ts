import { Generic_fromJSON, Generic_toJSON, IReviverValue, Reviver } from "../utils/JSONReviver";

// Array of all valid states
const AllCorporationStates: string[] = ["START", "PURCHASE", "PRODUCTION", "SALE", "EXPORT"];

export class CorporationState {
  // Number representing what state the Corporation is in. The number
  // is an index for the array that holds all Corporation States
  state = 0;

  // Get the name of the current state
  // NOTE: This does NOT return the number stored in the 'state' property,
  // which is just an index for the array of all possible Corporation States.
  getState(): string {
    return AllCorporationStates[this.state];
  }

  // Transition to the next state
  nextState(): void {
    if (this.state < 0 || this.state >= AllCorporationStates.length) {
      this.state = 0;
    }

    ++this.state;
    if (this.state >= AllCorporationStates.length) {
      this.state = 0;
    }
  }

  // Serialize the current object to a JSON save state.
  toJSON(): IReviverValue {
    return Generic_toJSON("CorporationState", this);
  }

  // Initiatizes a CorporationState object from a JSON save state.
  static fromJSON(value: IReviverValue): CorporationState {
    return Generic_fromJSON(CorporationState, value.data);
  }
}

Reviver.constructors.CorporationState = CorporationState;
