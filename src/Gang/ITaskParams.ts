export interface ITerritory {
  money: number;
  respect: number;
  wanted: number;
}

export interface ITaskParams {
  baseRespect?: number;
  baseWanted?: number;
  baseMoney?: number;
  hackWeight?: number;
  strWeight?: number;
  defWeight?: number;
  dexWeight?: number;
  agiWeight?: number;
  chaWeight?: number;
  difficulty?: number;
  territory?: ITerritory;
}
