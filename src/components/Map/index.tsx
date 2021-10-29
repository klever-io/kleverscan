import React, { Fragment, useState } from 'react';

import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { divIcon, LatLngExpression } from 'leaflet';

import { Container } from './styles';

import { INodeData } from '../../types';

interface IMapConfig {
  initialPosition: LatLngExpression;
  zoom: number;
}

interface IMap {
  nodes: INodeData[];
}

const Map: React.FC<IMap> = ({ nodes }) => {
  const [selectedNode, setSelectedNode] = useState<INodeData | null>(null);

  const mapConfig: IMapConfig = {
    initialPosition: [30, 0],
    zoom: 2,
  };

  const handleMarker = (node: INodeData) => {
    setSelectedNode(node);
  };

  const handlePopup = () => {
    setSelectedNode(null);
  };

  return (
    <Container>
      <MapContainer
        center={mapConfig.initialPosition}
        zoom={mapConfig.zoom}
        attributionControl={false}
      >
        <TileLayer
          url="http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
          attribution="&copy; <a href='http://basemaps.org/copyright>Base Maps</a> contributors'"
        />

        {nodes.map((node, index) => (
          <Fragment key={String(index)}>
            <Marker
              position={node.location}
              icon={divIcon({
                className: 'map-cluster',
                html: `<b>${node.count}</b>`,
              })}
              eventHandlers={{
                click: () => handleMarker(node),
              }}
            />

            {node.nodes?.map((subNode, subIndex) => (
              <Marker
                key={String(subIndex)}
                position={subNode.location}
                icon={divIcon({ className: 'map-marker' })}
                eventHandlers={{
                  click: () => handleMarker(subNode),
                }}
              />
            ))}
          </Fragment>
        ))}

        {selectedNode && (
          <Popup position={selectedNode.location} onClose={handlePopup}>
            <div>
              <span>{selectedNode.name}</span>
            </div>
          </Popup>
        )}
      </MapContainer>
    </Container>
  );
};

export default Map;
