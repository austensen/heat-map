import React from "react";
import { renderToString } from "react-dom/server";

export type FeatureProps = {
  bbl: string;
  address: string;
  units: number | null;
  rs_units: number | null;
  // the original geojson has an array of strings, but once the data is passed
  // to mapboxgl and then accessed for a given point (for popup) the array get's
  // stringified (known issue: https://github.com/mapbox/mapbox-gl-js/issues/2434)
  complaint_details: string | string[];
  complaints_last_season: number;
  complaints_this_season: number;
};

const ComplaintsTable: React.FC<FeatureProps> = (props: FeatureProps) => (
  // In the original geojson data "complaint_details" is an array of complaint
  // records where each is a pipe-delimited string of apartment and date, but
  // mapboxgl doesn't allow properties to contain nested objects, so the array
  // of complaint records get's stringified
  // https://github.com/mapbox/mapbox-gl-js/issues/2434
  <div className="complaints-table">
    <table>
      <tr>
        <th>Apt</th>
        <th>Date</th>
      </tr>
      {JSON.parse(props.complaint_details as string).map(
        (row: string, i: number) => {
          const [apt, date] = row.split("|", 2);
          return (
            <tr key={i}>
              <td>{apt}</td>
              <td>{date}</td>
            </tr>
          );
        }
      )}
    </table>
  </div>
);

const bblDash = (
  <span className="unselectable" unselectable="on">
    -
  </span>
);

const FormattedBbl: React.FC<FeatureProps> = ({ bbl }: FeatureProps) => {
  return (
    <span className="bbl">
      {bbl.slice(0, 1)}
      {bblDash}
      {bbl.slice(1, 6)}
      {bblDash}
      {bbl.slice(6, 10)}
    </span>
  );
};

const PropertyLinks: React.FC<FeatureProps> = ({
  bbl,
  address,
}: FeatureProps) => (
  <div className="property-links">
    <a href={`https://whoownswhat.justfix.org/bbl/${bbl}`}>Who Owns What</a>
    <br />
    <a href={`https://portal.displacementalert.org/property/${bbl}`}>
      DAP Portal
    </a>
    <br />
    <a
      href={`https://www.google.com/maps/search/?api=1&query=${encodeURI(
        address
      )}`}
    >
      Google Maps
    </a>
  </div>
);

const BuildingIndicatorsTable: React.FC<FeatureProps> = ({
  units,
  rs_units,
  complaints_last_season,
  complaints_this_season,
}: FeatureProps) => (
  <table className="indicators-table">
    <tr>
      <td>Units:</td>
      <td>{units?.toLocaleString()}</td>
    </tr>
    <tr>
      <td>Rent Stabilized Units:</td>
      <td>{rs_units?.toLocaleString()}</td>
    </tr>
    <tr>
      <td>Complaints This Season:</td>
      <td>{complaints_this_season?.toLocaleString()}</td>
    </tr>
    <tr>
      <td>Complaints Last Season:</td>
      <td>{complaints_last_season?.toLocaleString()}</td>
    </tr>
  </table>
);

const BuildingInfo: React.FC<FeatureProps> = (props: FeatureProps) => {
  return (
    <div className="building-info">
      <div>
        <FormattedBbl {...props} />
        <PropertyLinks {...props} />
        <br />
        <BuildingIndicatorsTable {...props} />
      </div>
    </div>
  );
};

export const makePopup = (props: FeatureProps) => {
  return renderToString(
    <>
      <h2>{props.address}</h2>
      <div className="popup-col-container">
        <BuildingInfo {...props} />
        <ComplaintsTable {...props} />
      </div>
    </>
  );
};
