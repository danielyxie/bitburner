import { PlayerObject }                         from "../../Player";
import { Cities }                               from "../../Locations/Cities";

PlayerObject.prototype.travel = function(to) {
    if (Cities[to] == null) {
        console.warn(`Player.travel() called with invalid city: ${to}`);
        return false;
    }
    this.city = to;

    return true;
}
