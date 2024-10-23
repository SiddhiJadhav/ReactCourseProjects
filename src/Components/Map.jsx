/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import styles from './Map.module.css';
import { useCities } from '../contexts/CitiesContext';
import { useEffect, useState } from 'react';
import { useGeolocation } from '../hooks/useGeoLocation';
import Button from './Button';

export default function Map() {
  const { cities } = useCities();

  const [mapPosition, setPosition] = useState([40, 0]);

  const [searchParams, setSearchParams] = useSearchParams();
  const mapLat = searchParams.get('lat');
  const mapLng = searchParams.get('lng');

  const {
    isLoading: isLocationLoading,
    position: geoLocation,
    getPosition,
  } = useGeolocation();

  useEffect(() => {
    if (Object.entries(geoLocation).length) {
      setPosition([geoLocation.lat, geoLocation.lng]);
    }
  }, [geoLocation]);

  useEffect(
    function () {
      if (!mapLat || !mapLng) return;
      if (mapLat && mapLng) setPosition([mapLat, mapLng]);
    },
    [mapLat, mapLng]
  );

  //const { lat, lng } = currentCity.position;
  return (
    <div className={styles.mapContainer}>
      <Button type="position" onClick={getPosition}>
        {isLocationLoading ? 'Loading...' : 'Load your position'}
      </Button>
      <MapContainer
        center={mapPosition}
        zoom={13}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.fr/hot/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map(city => {
          return (
            <Marker position={city.position} key={city.id}>
              <Popup>
                <span>{city.emoji}</span>
                <span>{city.cityName}</span>
              </Popup>
            </Marker>
          );
        })}
        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();
  useMapEvents({
    click: e => {
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });
}
