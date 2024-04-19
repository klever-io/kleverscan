import { divIcon, LatLngExpression } from 'leaflet';
import React, { Fragment } from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import 'react-leaflet-markercluster/dist/styles.min.css';
import { Node } from '../../types';
import { Container } from './styles';

interface IMapConfig {
  initialPosition: LatLngExpression;
  zoom: number;
}

interface IMap {
  nodes?: Node[];
}

const Map: React.FC<IMap> = ({ nodes }) => {
  const mapConfig: IMapConfig = {
    initialPosition: [30, 0],
    zoom: 1,
  };

  return (
    <Container>
      <MapContainer
        center={mapConfig.initialPosition}
        zoom={mapConfig.zoom}
        attributionControl={false}
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
