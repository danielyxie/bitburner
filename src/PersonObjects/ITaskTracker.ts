// Interface that defines a generic object used to track experience/money
// earnings for tasks
export interface ITaskTracker {
    hack: number;
    str: number;
    def: number;
    dex: number;
    agi: number;
    cha: number;
    int: number;
    money: number;
  }
  
  export function createTaskTracker(): ITaskTracker {
    return {
      hack: 0,
      str: 0,
      def: 0,
      dex: 0,
      agi: 0,
      cha: 0,
      int: 0,
      money: 0,
    };
  }