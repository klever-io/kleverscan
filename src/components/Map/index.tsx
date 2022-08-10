import Copy from '@/components/Copy';
import { divIcon, LatLngExpression, MarkerCluster } from 'leaflet';
import React, { Fragment } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'react-leaflet-markercluster/dist/styles.min.css';
import { ICountryNode, IPeerData } from '../../types';
import { Container, Row } from './styles';

interface IMapConfig {
  initialPosition: LatLngExpression;
  zoom: number;
}

interface IMap {
  nodes: ICountryNode[];
}

const Map: React.FC<IMap> = ({ nodes }) => {
  const mapConfig: IMapConfig = {
    initialPosition: [30, 0],
    zoom: 2,
  };

  const createClusterCustomIcon = function (cluster: MarkerCluster) {
    return divIcon({
      html: `<b>${cluster.getChildCount()}</b>`,
      className: 'map-cluster',
    });
  };

  const nodeInfos = (nodeData: IPeerData) => {
    const { peertype, pid, isblacklisted, pk } = nodeData;

    return (
      <>
        <Row>
          <span>
            <strong>Peer type</strong>
          </span>
          <span>{peertype}</span>
        </Row>
        <Row>
          <span>
            <strong>Black Listed</strong>
          </span>
          <span>{isblacklisted.toString()}</span>
        </Row>
        <Row>
          <span>
            <strong>PID</strong>
          </span>
          <span>{pid}</span>
          <Copy info="PID" data={pid} />
        </Row>
        <Row>
          <span>
            <strong>Public Key</strong>
          </span>
          <span>{pk}</span>
          <Copy info="Public Key" data={pk} />
        </Row>
      </>
    );
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
              {node.nodes?.map((subNode, subIndex) => {
                return (
                  <Marker
                    key={String(subIndex)}
                    position={subNode.coordenates[0]}
                    icon={divIcon({ className: 'map-marker' })}
                  >
                    <Popup>{nodeInfos(subNode.data)}</Popup>
                  </Marker>
                );
              })}
            </MarkerClusterGroup>
          </Fragment>
        ))}
      </MapContainer>
    </Container>
  );
};

export default Map;
