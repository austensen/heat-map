import React from "react";
import ReactDOM from "react-dom";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { getHTMLElement } from "@justfixnyc/util";
import BuildingMap from "./lib/map";
import { JsonLoader } from "./lib/json-loader";
import { HEAT_BUILDINGS } from "./lib/heat-buildings";

const IndexPage: React.FC<{}> = () => {
  return (
    <JsonLoader url={HEAT_BUILDINGS.geojson} fallback={<h1>Loading...</h1>}>
      {(data) => <BuildingMap geojson={data} />}
    </JsonLoader>
  );
};

const App: React.FC<{}> = () => {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />}></Route>
    </Routes>
  );
};

async function main() {
  ReactDOM.render(
    <BrowserRouter basename="heat-map">
      <App />
    </BrowserRouter>,
    getHTMLElement("div", "#app")
  );
}

main();
