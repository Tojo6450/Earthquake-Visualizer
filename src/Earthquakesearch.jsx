import React, { useState } from 'react';

// This helper function calculates the distance between two points on Earth.
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

const EarthquakeSearch = () => {
  const [location, setLocation] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!location.trim()) {
      setError('Please enter a location.');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      // Step 1: Geocode the location name to get coordinates
      const geoResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`
      );
      const geoData = await geoResponse.json();

      if (geoData.length === 0) {
        throw new Error(`Location "${location}" not found. Please be more specific.`);
      }
      const searchLat = parseFloat(geoData[0].lat);
      const searchLon = parseFloat(geoData[0].lon);

      // Step 2: Fetch all recent earthquakes
      const quakeResponse = await fetch(
        'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson'
      );
      const quakeData = await quakeResponse.json();

      // Step 3: Find earthquakes near the searched location
      const searchRadius = 200; // in kilometers
      const nearbyQuakes = quakeData.features.filter(quake => {
        const quakeLat = quake.geometry.coordinates[1];
        const quakeLon = quake.geometry.coordinates[0];
        const distance = getDistance(searchLat, searchLon, quakeLat, quakeLon);
        return distance <= searchRadius;
      });

      setResult({
        count: nearbyQuakes.length,
        locationName: geoData[0].display_name,
        radius: searchRadius,
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-slate-100 shadow-inner">
      <form 
        onSubmit={handleSearch} 
        className="flex flex-col sm:flex-row gap-2 max-w-xl mx-auto bg-white p-3 rounded-lg shadow-md"
      >
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter a city or region..."
          className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white font-bold p-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 shadow-sm"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {/* --- Results Display --- */}
      <div className="text-center mt-4 text-lg max-w-xl mx-auto">
        {error && (
          <p className="text-red-600 font-semibold bg-red-50 p-3 rounded-md shadow-sm">
            ⚠️ {error}
          </p>
        )}
        {result && (
          <div className="text-green-800 bg-green-100 p-3 rounded-md shadow-md">
            Found <strong>{result.count}</strong> earthquake(s) within {result.radius} km of <br/>
            <span className="font-semibold">{result.locationName}</span>.
          </div>
        )}
      </div>
    </div>
  );
};

export default EarthquakeSearch;
