import { BaseServer } from "../../Server/BaseServer";

import { commonEditor } from "./common/editor";

export function nano(args: (string | number | boolean)[], server: BaseServer): void {
  return commonEditor("nano", { args, server });
}
