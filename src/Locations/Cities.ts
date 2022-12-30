import { City } from "./City";
import { CityName } from "../Enums";

export const Cities: Record<CityName, City> = {
  [CityName.Aevum]: new City(CityName.Aevum),
  [CityName.Chongqing]: new City(CityName.Chongqing),
  [CityName.Ishima]: new City(CityName.Ishima),
  [CityName.NewTokyo]: new City(CityName.NewTokyo),
  [CityName.Sector12]: new City(CityName.Sector12),
  [CityName.Volhaven]: new City(CityName.Volhaven),
};
