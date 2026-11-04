import type { LatLngTuple } from 'leaflet';
import { Node } from '../../types';

export interface Site {
  position: LatLngTuple;
  count: number;
}

export interface Link {
  id: string;
  from: LatLngTuple;
  to: LatLngTuple;
  length: number;
}

export interface Network {
  sites: Site[];
  links: Link[];
}

const groupSites = (nodes: Node[]): Site[] => {
  const sites = new Map<string, Site>();
  nodes.forEach(({ coordinates: [lat, lng] }) => {
    const key = `${lat.toFixed(1)}:${lng.toFixed(1)}`;
    const site = sites.get(key);
    if (site) site.count += 1;
    else sites.set(key, { position: [lat, lng], count: 1 });
  });
  return Array.from(sites.values()).sort((a, b) => b.count - a.count);
};

const distance = ([aLat, aLng]: LatLngTuple, [bLat, bLng]: LatLngTuple) => {
  const x = (bLng - aLng) * Math.cos((((aLat + bLat) / 2) * Math.PI) / 180);
  return Math.hypot(x, bLat - aLat);
};

const spanningTree = (sites: Site[]): [number, number][] => {
  if (sites.length < 2) return [];
  const inTree = sites.map((_, index) => index === 0);
  const best = sites.map(site => distance(sites[0].position, site.position));
  const parent = sites.map(() => 0);
  const edges: [number, number][] = [];

  for (let step = 1; step < sites.length; step++) {
    let next = -1;
    best.forEach((value, index) => {
      if (!inTree[index] && (next < 0 || value < best[next])) next = index;
    });
    inTree[next] = true;
    edges.push([parent[next], next]);
    sites.forEach((site, index) => {
      const value = distance(sites[next].position, site.position);
      if (!inTree[index] && value < best[index]) {
        best[index] = value;
        parent[index] = next;
      }
    });
  }

  return edges;
};

export const buildNetwork = (nodes: Node[]): Network => {
  const sites = groupSites(nodes);
  const links = spanningTree(sites).map(([from, to]) => ({
    id: `${from}-${to}`,
    from: sites[from].position,
    to: sites[to].position,
    length: distance(sites[from].position, sites[to].position),
  }));
  return { sites, links };
};
