import React, { useEffect, useMemo, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { ILatLng } from '../../types/badmintonCourt.types';

interface IProps {
  location?: ILatLng;
  handleClickMap?: (latlng: ILatLng | null) => void;
}

export default function HanoiMap({ location, handleClickMap }: IProps) {
  const checkLatLng = useMemo(() => {
    if (!location) {
      return null;
    }
    if (isNaN(location.lat) || isNaN(location.lng)) {
      return null;
    }
    return location;
  }, [location]);

  const [markerPosition, setMarkerPosition] = useState<ILatLng | null>(
    checkLatLng,
  );

  useEffect(() => {
    if(checkLatLng) setMarkerPosition(checkLatLng);
  }, [checkLatLng])

  const ClickableMap: React.FC<{
    setMarkerPosition: (latlng: ILatLng | null) => void;
  }> = ({ setMarkerPosition }) => {
    useMapEvents({
      click: (event) => {
        setMarkerPosition(event.latlng);
      },
    });

    return null;
  };

  return (
    <MapContainer
      center={
        checkLatLng ? [checkLatLng!.lat, checkLatLng!.lng] : [21.0285, 105.804]
      }
      zoom={13}
      style={{ height: '400px', width: '100%' }}
      className="cursor-map"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <ClickableMap
        setMarkerPosition={(latlng) => {
          if (handleClickMap) {
            handleClickMap(latlng);
            setMarkerPosition(latlng);
          }
        }}
      />
      {markerPosition && (
        <Marker position={markerPosition}>
          <Popup>
            Vị trí sân cầu: {markerPosition.lat.toFixed(5)},{' '}
            {markerPosition.lng.toFixed(5)}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
