import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Your existing icon fix code...
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Helper component to fix resizing issues
function MapResize() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);
  return null;
}

const EarthquakeMap = () => {
  const [earthquakes, setEarthquakes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEarthquakes = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson');
        const data = await response.json();
        setEarthquakes(data.features);
      } catch (error) {
        console.error("Failed to fetch earthquake data:", error);
      }
      setIsLoading(false);
    };
    fetchEarthquakes();
  }, []);

  return (
    <div className="p-4 flex justify-center">
      {/* Map frame container */}
      <div className="relative w-full max-w-5xl h-[550px] shadow-lg rounded-lg overflow-hidden border-2 border-slate-300">
        {isLoading && (
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-[1000]">
            <div className="text-white text-2xl animate-pulse">Loading Seismic Data... 🛰️</div>
          </div>
        )}

        {/* Map Container */}
        <MapContainer center={[20, 0]} zoom={2} scrollWheelZoom={true} className="w-full h-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapResize />

          {earthquakes.map((quake) => {
            const coords = quake.geometry.coordinates;
            const position = [coords[1], coords[0]];
            return (
              <Marker key={quake.id} position={position}>
                <Popup>
                  <div className="font-sans">
                    <p className="font-bold text-md m-0">{quake.properties.place || 'Unknown location'}</p>
                    <hr className="my-1"/>
                    <p className="m-0"><strong>Magnitude:</strong> {quake.properties.mag}</p>
                    <p className="m-0"><strong>Depth:</strong> {coords[2]} km</p>
                    <p className="m-0"><strong>Time:</strong> {new Date(quake.properties.time).toLocaleString()}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default EarthquakeMap;
