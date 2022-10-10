import { Query, QueryFiles } from "./query";

export const HEAT_BUILDINGS = new QueryFiles(`heat-buildings`);

export const HeatBuildingsQuery: Query = {
  files: HEAT_BUILDINGS,
};
