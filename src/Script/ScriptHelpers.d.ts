export declare function findRunningScript(
  filename: string,
  args: (string | number)[],
  server: BaseServer,
): RunningScript | null;
export declare function findRunningScriptByPid(pid: number, server: BaseServer): RunningScript | null;
