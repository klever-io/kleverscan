import React, { Fragment } from 'react';

import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import { divIcon, LatLngExpression, MarkerCluster } from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
require('react-leaflet-markercluster/dist/styles.min.css');

import { Container } from './styles';

import { ICountryNode } from '../../types';

interface IMapConfig {
  initialPosition: LatLngExpression;
  zoom: number;
}

interface IMap {
  nodes: ICountryNode[];
}

const Map: React.FC<IMap> = ({ nodes }) => {
  // const [selectedNode, setSelectedNode] = useState<ICountryNode | null>(null);

  const mapConfig: IMapConfig = {
    initialPosition: [30, 0],
    zoom: 2,
  };

  // const handleMarker = (node: ICountryNode) => {
  //   setSelectedNode(node);
  // };

  // const handlePopup = () => {
  //   setSelectedNode(null);
  // };

  const createClusterCustomIcon = function (cluster: MarkerCluster) {
    return divIcon({
      html: `<b>${cluster.getChildCount()}</b>`,
      className: 'map-cluster',
    });
  };

  return (
    <Container>
      <MapContainer
        center={mapConfig.initialPosition}
        zoom={mapConfig.zoom}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/light_nolabels/{z}/{x}/{y}.png"
          attribution="&copy; <a href='http://basemaps.org/copyright>Base Maps</a> contributors'"
        />

        {nodes.map((node, index) => (
          <Fragment key={String(index)}>
            <MarkerClusterGroup
              showCoverageOnHover={false}
              iconCreateFunction={createClusterCustomIcon}
            >
              {node.nodes?.map((subNode, subIndex) => (
                <Marker
                  key={String(subIndex)}
                  position={subNode}
                  icon={divIcon({ className: 'map-marker' })}
                />
              ))}
            </MarkerClusterGroup>
          </Fragment>
        ))}
        {/* 
        {selectedNode && (
          <Popup position={selectedNode.location} onClose={handlePopup}>
            <div>
              <span>{selectedNode.name}</span>
            </div>
          </Popup>
        )} */}
      </MapContainer>
    </Container>
  );
};

export default Map;
