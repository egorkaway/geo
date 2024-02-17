// pages/location.tsx
import React, { useEffect, useState } from 'react';

const BottomWidget: React.FC<{ 
    cityName: string, 
    onCityNameChange: (newCityName: string, coordinates?: { latitude: number, longitude: number }) => void 
}> = ({ cityName, onCityNameChange }) => {
  const [randomCity, setRandomCity] = useState<string>('');
  const [coordinates, setCoordinates] = useState<{ latitude: number, longitude: number } | null>(null);

  useEffect(() => {
    const fetchRandomCity = async () => {
      const response = await fetch('/api/random_city?x=1');
      const data: {cities: {City: string}[]} = await response.json();
      if (data.cities[0]) {
        setRandomCity(data.cities[0].City);
      }
    };
    fetchRandomCity();
  }, []);

  const handleOnClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async position => {
        const currentCoordinates = { latitude: position.coords.latitude, longitude: position.coords.longitude };
        setCoordinates(currentCoordinates);
        const response = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${currentCoordinates.latitude}&lon=${currentCoordinates.longitude}&limit=1&appid=e7e06f3f2654e34e138f3d09ea001917`);
        const data = await response.json();
        if (data[0]) {
          onCityNameChange(data[0].name, currentCoordinates);
          // Call the /api/visit API for the current city and include coordinates
          // Commenting out the API call to 1weather as instructed
          /*
          const visitResponse = await fetch('https://1weather.replit.app/api/visit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              'city': data[0].name,
              'coordinates': currentCoordinates
            })
          });
          const visitData = await visitResponse.json();
          */
        }
      }, error => {
        console.error("Error fetching geolocation data:", error);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleRandomCityClick = () => {
    onCityNameChange(randomCity);
    setCoordinates(null);
  };

  return (
    <div>
      <div onClick={handleOnClick} style={{
        width: '220px',
        border: '2px solid #ccc',
        backgroundColor: '#466E8B',
        borderRadius: '12px',
        overflow: 'hidden',
        textAlign: 'center',
        padding: '10px', 
        cursor: 'pointer'
      }}
      >
      <h1 style={{color: 'white', margin: 0, fontSize: '20px'}} >{cityName} </h1>
      <p style={{ color: 'white', margin: '4px 0', fontSize: '12px' }}>
{coordinates ? 
`\uD83C\uDF10: Latitude: ${coordinates.latitude.toFixed(5)}\nLongitude: ${coordinates.longitude.toFixed(5)}` : "Click or tap here to get lat / lon for the current location"}
</p>
      </div>

      {randomCity && (
        <div onClick={handleRandomCityClick} style={{
          width: '220px',
          border: '2px solid #ccc',
          backgroundColor: '#466E8B',
          borderRadius: '12px',
          marginTop: '10px',
          textAlign: 'center',
          padding: '10px',
         }}
        >
        </div>
      )}
    </div>
  );
};

export default BottomWidget;