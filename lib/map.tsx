import React, { useEffect, useRef, useState } from "react";
import mapboxgl, { Map, CirclePaint } from "mapbox-gl";
import { FeatureProps, makePopup } from "./popup";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_KEY!;

const MAPBOX_STYLE = "mapbox://styles/justfix/ckhevcljr02jg19l3jtw9h9w6";

type LatLng = [number, number];

const DEFAULT_CENTER: LatLng = [-73.957117, 40.653632];

const DEFAULT_ZOOM = 11.5;

const MAP_CONFIGURABLES = {
  accessToken: MAPBOX_ACCESS_TOKEN,
  style: MAPBOX_STYLE,
  containerStyle: { width: "100%", height: "100%" },
  center: DEFAULT_CENTER,
  zoom: DEFAULT_ZOOM,
};

const PAINT_OPTIONS: CirclePaint = {
  "circle-color": [
    "interpolate",
    ["linear"],
    ["get", "complaints_last_season"],
    0,
    "#6A00A8",
    5,
    "#C33D80",
    10,
    "#F68F44",
    20,
    "#F0F921",
  ],
  "circle-opacity": [
    "interpolate",
    ["linear"],
    ["get", "complaints_last_season"],
    0,
    0.4,
    5,
    0.5,
    10,
    0.6,
    20,
    0.8,
  ],
  "circle-radius": {
    base: 3,
    stops: [
      [12, 3],
      [14, 5],
      [16, 8],
    ],
  },
  "circle-stroke-width": ["interpolate", ["linear"], ["zoom"], 15, 0, 17, 0.5],
  "circle-stroke-color": "#FFFFFF",
};

const BuildingMap: React.FC<{ geojson: any }> = ({ geojson }: any) => {
  // https://sparkgeo.com/blog/build-a-react-mapboxgl-component-with-hooks/

  // this is where the map instance will be stored after initialization
  const [map, setMap] = useState<Map>();

  // React ref to store a reference to the DOM node that will be used
  // as a required parameter `container` when initializing the mapbox-gl
  // will contain `null` by default
  const mapNode = useRef(null);

  useEffect(() => {
    const node = mapNode.current;
    // if the window object is not found, that means
    // the component is rendered on the server
    // or the dom node is not initialized, then return early
    if (typeof window === "undefined" || node === null) return;

    // otherwise, create a map instance
    const map = new Map({
      container: node,
      ...MAP_CONFIGURABLES,
    });

    map.on("load", () => {
      map.addSource("points", {
        type: "geojson",
        data: geojson,
      });
      map.addLayer({
        id: "points",
        type: "circle",
        source: "points",
        paint: PAINT_OPTIONS,
      });
    });

    // When a click event occurs on a feature in the places layer, open a popup at the
    // location of the feature, with description HTML from its properties.
    map.on("click", "points", (e) => {
      const props = e.features![0].properties! as FeatureProps;
      new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(makePopup(props))
        .setMaxWidth("400px")
        .addTo(map);
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on("mouseenter", "points", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    // Change it back to a pointer when it leaves.
    map.on("mouseleave", "points", () => {
      map.getCanvas().style.cursor = "";
    });

    // save the map object to useState
    setMap(map);

    return () => {
      map.remove();
    };
  }, []);

  return <div ref={mapNode} style={{ width: "100%", height: "100%" }} />;
};

export default BuildingMap;
