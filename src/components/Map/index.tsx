import { divIcon, LatLngExpression } from 'leaflet';
import React, { Fragment } from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import 'react-leaflet-markercluster/dist/styles.min.css';
import { Node } from '../../types';
import { Container } from './styles';
import { useMobile } from '@/contexts/mobile';

interface IMapConfig {
  initialPosition: LatLngExpression;
  zoom: number;
}

interface IMap {
  nodes?: Node[];
}

const Map: React.FC<IMap> = ({ nodes }) => {
  const { isMobile, isTablet } = useMobile();

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
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/dark_nolabels/{z}/{x}/{y}.png"
          attribution="&copy; <a href='http://basemaps.org/copyright rel='nofollow'>Base Maps</a> contributors'"
        />

        <Fragment>
          {nodes &&
            nodes.map((node, index) => (
              <Marker
                key={String(index)}
                position={node.coordinates}
                icon={divIcon({ className: 'map-marker' })}
              ></Marker>
            ))}
        </Fragment>
      </MapContainer>
    </Container>
  );
};

export default Map;
