'use client';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

export interface VisitDTO {
  _id: string; name: string; lat: number; lng: number; at: string;
}

const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapView({ visits }: { visits: VisitDTO[] }) {
  const center: [number, number] = visits.length
    ? [visits[0].lat, visits[0].lng]
    : [20.59, 78.96];

  return (
    <MapContainer center={center} zoom={visits.length ? 13 : 5} style={{ height: '90vh' }}>
      <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {visits.map(v => (
        <Marker key={v._id} position={[v.lat, v.lng]} icon={icon}>
          <Popup>
            <b>{v.name}</b><br />Here you are 👋<br />
            {new Date(v.at).toLocaleString()}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}