import { useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MatchMapPopup from './MatchMapPopup';

const center = [48.8915, 2.245];
const cityCoordinates = {
  Nanterre: [48.8924, 2.2067],
  Puteaux: [48.8847, 2.2382],
  Courbevoie: [48.8967, 2.2567],
  Levallois: [48.8932, 2.2879],
  'Levallois-Perret': [48.8932, 2.2879],
};

function positionFor(match) {
  const latitude = Number(match.latitude);
  const longitude = Number(match.longitude);
  const cityPosition = cityCoordinates[match.city];
  // TeamUp couvre actuellement l'ouest parisien : on ignore une coordonnée
  // manifestement hors région (ex. redirection Google vers un autre pays).
  const isParisRegion = latitude >= 48.5 && latitude <= 49.2 && longitude >= 1.5 && longitude <= 3.5;
  if (Number.isFinite(latitude) && Number.isFinite(longitude) && (isParisRegion || !cityPosition)) return [latitude, longitude];
  return cityPosition || null;
}

export { positionFor };

function sportColor(match) {
  return String(match.sport_name).toLowerCase().includes('basket') ? '#F97316' : '#65A30D';
}

function markerIcon(match) {
  const color = sportColor(match);
  return L.divIcon({
    className: 'teamup-map-marker',
    html: `<span style="background:${color};box-shadow:0 3px 10px rgba(15,23,42,.22)"></span>`,
    iconSize: [26, 26],
    iconAnchor: [13, 26],
    popupAnchor: [0, -24],
  });
}

function MapRecenter({ matches }) {
  const map = useMap();
  useEffect(() => {
    const positions = matches.map(positionFor).filter(Boolean);
    if (!positions.length) return;
    const bounds = L.latLngBounds(positions);
    map.fitBounds(bounds, { padding: [36, 36], maxZoom: 13 });
  }, [map, matches]);
  return null;
}

export default function MatchMap({ matches }) {
  const mappableMatches = matches.filter((match) => positionFor(match));
  return (
    <div className="teamup-map overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm" style={{ height: 'min(600px, 70vh)', width: '100%' }}>
      <MapContainer center={center} zoom={12} scrollWheelZoom style={{ height: '100%', width: '100%' }} whenReady={(event) => event.target.invalidateSize()}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapRecenter matches={mappableMatches} />
        {mappableMatches.map((match) => (
          <Marker key={match.id} position={positionFor(match)} icon={markerIcon(match)}>
            <Popup><MatchMapPopup match={match} color={sportColor(match)} /></Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
