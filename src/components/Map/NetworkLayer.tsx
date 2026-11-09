import type { LatLngTuple, Map as LeafletMap } from 'leaflet';
import React, { useMemo, useReducer } from 'react';
import { createPortal } from 'react-dom';
import { useMap, useMapEvents } from 'react-leaflet';
import { Link } from './network';

interface INetworkLayer {
  links: Link[];
  offsets: number[];
}

const PANE = 'network';
const BEND = 0.3;

const toLayerPoint = (
  map: LeafletMap,
  [lat, lng]: LatLngTuple,
  offset: number,
) => map.project([lat, lng + offset]).subtract(map.getPixelOrigin());

const curve = (map: LeafletMap, link: Link, offset: number) => {
  const start = toLayerPoint(map, link.from, offset);
  const end = toLayerPoint(map, link.to, offset);
  const side = end.x >= start.x ? 1 : -1;
  const controlX = (start.x + end.x) / 2 + (end.y - start.y) * BEND * side;
  const controlY = (start.y + end.y) / 2 - (end.x - start.x) * BEND * side;
  const format = (value: number) => value.toFixed(2);
  return `M${format(start.x)} ${format(start.y)}Q${format(controlX)} ${format(
    controlY,
  )} ${format(end.x)} ${format(end.y)}`;
};

const NetworkLayer: React.FC<INetworkLayer> = ({ links, offsets }) => {
  const map = useMap();
  const [, refresh] = useReducer((count: number) => count + 1, 0);

  useMapEvents({ viewreset: refresh, zoomend: refresh });

  const pane = useMemo(
    () => map.getPane(PANE) ?? map.createPane(PANE, map.getPane('overlayPane')),
    [map],
  );

  return createPortal(
    <svg className="map-network">
      {offsets.flatMap(offset =>
        links.map((link, index) => {
          const path = curve(map, link, offset);
          const duration = 1.6 + link.length / 45;
          return (
            <g key={`${offset}:${link.id}`}>
              <path className="map-link" d={path} />
              <g className="map-link-traveler">
                <circle className="map-link-halo" r={6} />
                <circle className="map-link-dot" r={3} />
                <animateMotion
                  path={path}
                  dur={`${duration}s`}
                  begin={`${-((index * 1.37) % duration)}s`}
                  repeatCount="indefinite"
                />
              </g>
            </g>
          );
        }),
      )}
    </svg>,
    pane,
  );
};

export default NetworkLayer;
