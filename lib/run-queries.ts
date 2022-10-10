import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { nycdbConnector } from "./db";
import { Query } from "./query";
import { HeatBuildingsQuery} from './heat-buildings'

async function processQuery(query: Query) {
  const data = await getQueryOutput(query);
  writeQueryOutputFile(query, data);
}

function writeQueryOutputFile(query: Query, data: any) {
  const staticDir = 'static';
  const geojsonOutfile = `${staticDir}/${query.files.geojson}`;
  if (!existsSync(staticDir)) {
    mkdirSync(staticDir);
  }

  console.log(`Writing ${geojsonOutfile}.`);
  writeFileSync(geojsonOutfile, JSON.stringify(data.geojson, null, 2)); //
}

async function getQueryOutput(query: Query): Promise<any> {
  const nycdb = nycdbConnector.get();
  const sqlfile = `sql/${query.files.sql}`;
  const sql = readFileSync(sqlfile, { encoding: "utf-8" });
  console.log(`Running SQL in ${sqlfile}.`);
  return (await nycdb.one(sql));
}

export async function main() {
  const nycdb = nycdbConnector.get();

  try {
    await processQuery(HeatBuildingsQuery);
  } finally {
    await nycdb.$pool.end();
  }
}
