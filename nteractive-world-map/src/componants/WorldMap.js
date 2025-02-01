import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { db } from "../firebase"; 
import { collection, addDoc, getDocs } from "firebase/firestore";

// Custom Pin Icon
const pinIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2776/2776067.png",
  iconSize: [30, 40],
  iconAnchor: [15, 40],
  popupAnchor: [0, -35],
});

const WorldMap = () => {
  const [pins, setPins] = useState([]);

  useEffect(() => {
    const fetchPins = async () => {
      const pinsCollection = await getDocs(collection(db, "pins"));
      setPins(pinsCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchPins();
  }, []);

  const addPin = async (lat, lng) => {
    const comment = prompt("Enter your comment:");
    if (!comment) return;

    const newPin = { lat, lng, comment };
    const docRef = await addDoc(collection(db, "pins"), newPin);
    setPins([...pins, { id: docRef.id, ...newPin }]);
  };

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        addPin(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  };

  return (
    <MapContainer center={[20, 0]} zoom={2} style={{ height: "100vh", width: "100%" }}>
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

      {pins.map((pin) => (
        <Marker key={pin.id} position={[pin.lat, pin.lng]} icon={pinIcon}>
          <Popup>{pin.comment}</Popup>
        </Marker>
      ))}

      <MapClickHandler />
    </MapContainer>
  );
};

export default WorldMap;
