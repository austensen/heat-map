export type Query = {
  files: QueryFiles,
};

export class QueryFiles {
  readonly sql: string;
  readonly geojson: string;

  constructor(readonly baseName: string) {
    this.sql = `${baseName}.sql`;
    this.geojson = `${baseName}.geojson`;
  }
}
