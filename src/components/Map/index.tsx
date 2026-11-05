import { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import {
  divIcon,
  LatLngBoundsExpression,
  LatLngExpression,
  latLng,
  PathOptions,
} from 'leaflet';
import type { FeatureCollection } from 'geojson';
import React from 'react';
import { GeoJSON, MapContainer, Marker } from 'react-leaflet';
import 'react-leaflet-markercluster/dist/styles.min.css';
import { Node } from '../../types';
import { buildNetwork } from './network';
import NetworkLayer from './NetworkLayer';
import { Container } from './styles';
import { useMobile } from '@/contexts/mobile';

interface IMapConfig {
  initialPosition: LatLngExpression;
  zoom: number;
}

interface IMap {
  nodes?: Node[];
}

const WORLD_COPIES = [-360, 0, 360];

const VERTICAL_BOUNDS: LatLngBoundsExpression = [
  [-85, -100000],
  [85, 100000],
];

const countryStyle: PathOptions = {
  color: '#3a3a3a',
  weight: 0.5,
  fillColor: '#2c2c2c',
  fillOpacity: 1,
};

const markerSize = (count: number) =>
  Math.round(6 + Math.min(Math.sqrt(count - 1) * 2, 8));

const Map: React.FC<PropsWithChildren<IMap>> = ({ nodes }) => {
  const { isMobile, isTablet } = useMobile();
  const [countries, setCountries] = useState<FeatureCollection | null>(null);

  useEffect(() => {
    let active = true;
    import('./countries')
      .then(module => {
        if (active) setCountries(module.countries);
      })
      .catch(error => {
        console.error('Failed to load map country outlines', error);
      });
    return () => {
      active = false;
    };
  }, []);

  const { sites, links } = useMemo(() => buildNetwork(nodes ?? []), [nodes]);

  const siteCopies = useMemo(
    () =>
      WORLD_COPIES.flatMap(offset =>
        sites.map(site => {
          const size = markerSize(site.count);
          return {
            key: `${offset}:${site.position.join(':')}`,
            position: [
              site.position[0],
              site.position[1] + offset,
            ] as LatLngExpression,
            icon: divIcon({ className: 'map-marker', iconSize: [size, size] }),
          };
        }),
      ),
    [sites],
  );

  const mapConfig: IMapConfig = {
    initialPosition: [30, 0],
    zoom: isMobile ? 0.4 : isTablet ? 1 : 1.2,
  };

  return (
    <Container>
      <MapContainer
        center={mapConfig.initialPosition}
        zoom={mapConfig.zoom}
        attributionControl={false}
        zoomSnap={0.1}
        zoomControl={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        touchZoom={false}
        boxZoom={false}
        keyboard={false}
        worldCopyJump
        maxBounds={VERTICAL_BOUNDS}
        maxBoundsViscosity={1}
      >
        {countries &&
          WORLD_COPIES.map(offset => (
            <GeoJSON
              key={offset}
              data={countries}
              style={countryStyle}
              interactive={false}
              pane="tilePane"
              coordsToLatLng={coords => latLng(coords[1], coords[0] + offset)}
            />
          ))}

        <NetworkLayer links={links} offsets={WORLD_COPIES} />

        {siteCopies.map(site => (
          <Marker
            key={site.key}
            position={site.position}
            icon={site.icon}
            interactive={false}
          />
        ))}
      </MapContainer>
    </Container>
  );
};

export default Map;
