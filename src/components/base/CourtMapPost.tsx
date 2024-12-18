import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Visibility from './visibility';
import { LatLngExpression } from 'leaflet';

interface IProps {
  listLocation: {
    id: string;
    position: number[];
    address: string;
  }[];
}

export default function CourtMapPost({ listLocation }: IProps) {
  return (
    <MapContainer
      center={[21.0285, 105.83]}
      zoom={12}
      style={{ height: '100%', width: '100%' }}
      className="cursor-map"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Visibility visibility={Boolean(listLocation.length)}>
        {listLocation.map((location) => (
          <Marker
            key={location.id}
            position={location.position as LatLngExpression}
          >
            <Popup>Địa chỉ: {location.address}</Popup>
          </Marker>
        ))}
      </Visibility>
    </MapContainer>
  );
}
