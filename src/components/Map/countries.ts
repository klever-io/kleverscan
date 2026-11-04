import type { FeatureCollection, Geometry, Position } from 'geojson';
import { feature } from 'topojson-client';
import type { GeometryCollection, Topology } from 'topojson-specification';
import atlas from 'world-atlas/countries-110m.json';

const topology = atlas as unknown as Topology<{
  countries: GeometryCollection;
}>;

const seamIndexes = (ring: Position[]): number[] =>
  ring.flatMap((point, index) =>
    index > 0 && Math.abs(point[0] - ring[index - 1][0]) > 180 ? [index] : [],
  );

const unwrap = (ring: Position[]): Position[] => {
  let offset = 0;
  const unwrapped = ring.map((point, index) => {
    if (index > 0) {
      const delta = point[0] - ring[index - 1][0];
      if (delta > 180) offset -= 360;
      if (delta < -180) offset += 360;
    }
    return [point[0] + offset, point[1]];
  });
  const shift = Math.min(...unwrapped.map(([lng]) => lng)) < -180 ? 360 : 0;
  return unwrapped.map(([lng, lat]) => [lng + shift, lat]);
};

const closeAroundPole = (ring: Position[], seam: number): Position[] => {
  const rotated = [...ring.slice(seam), ...ring.slice(1, seam)];
  const first = rotated[0];
  const last = rotated[rotated.length - 1];
  const pole = first[1] < 0 ? -90 : 90;
  return [...rotated, [last[0], pole], [first[0], pole]];
};

const fixRing = (ring: Position[]): Position[] => {
  const seams = seamIndexes(ring);
  if (seams.length === 0) return ring;
  return seams.length % 2 ? closeAroundPole(ring, seams[0]) : unwrap(ring);
};

const fixGeometry = (geometry: Geometry): Geometry => {
  if (geometry.type === 'Polygon') {
    return { ...geometry, coordinates: geometry.coordinates.map(fixRing) };
  }
  if (geometry.type === 'MultiPolygon') {
    return {
      ...geometry,
      coordinates: geometry.coordinates.map(polygon => polygon.map(fixRing)),
    };
  }
  return geometry;
};

const collection = feature(topology, topology.objects.countries);

export const countries: FeatureCollection = {
  ...collection,
  features: collection.features.map(country => ({
    ...country,
    geometry: fixGeometry(country.geometry),
  })),
};
