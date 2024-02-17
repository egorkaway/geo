import React, { useState, useEffect } from 'react';
import BottomWidget from './location';
import { geoToH3 } from 'h3-js';  // Import the geoToH3 function from h3-js module

const transitionStyle = {
  transition: 'opacity 1.2s',
};

const ParentComponent: React.FC = () => {
  const [cityName, setCityName] = useState<string>('City');
  const [hasCoordinates, setHasCoordinates] = useState<boolean>(false);
  const [coordinates, setCoordinates] = useState<{ latitude: number, longitude: number } | null>(null);

  const [showBottomWidget, setShowBottomWidget] = useState<boolean>(false);

  // Initialize h3Indexes with 10 placeholders
  const [h3Indexes, setH3Indexes] = useState<string[]>(new Array(10).fill('Calculating...'));

  const handleCityNameChange = (
    newCityName: string,
    newCoordinates?: { latitude: number, longitude: number }
  ) => {
    setCityName(newCityName);
    if (newCoordinates) {
      setHasCoordinates(true);
      setCoordinates(newCoordinates);
      calculateH3Indexes(newCoordinates, 7);
      console.log(`Coordinates for new city: ${newCoordinates.latitude}, ${newCoordinates.longitude}`);
    } else {
      setHasCoordinates(false);
      setCoordinates(null);
    }
  };

  const calculateH3Indexes = (coordinates: { latitude: number, longitude: number }, resolution: number) => {
    try {
      // Calculating a single H3 index and keeping the rest as placeholders
      const h3Index = geoToH3(coordinates.latitude, coordinates.longitude, resolution);
      setH3Indexes(prevIndexes => [...prevIndexes.map((val, idx) => (idx === 0 ? `H3:${resolution} : ${h3Index}` : val))]);
    } catch (error) {
      // Log the error to the console and provide instructions for copying it
      console.error("Error calculating H3 index:", error);
      console.info("To copy the error details, right-click on the error message in the browser console and select 'Store as global variable'. Then right-click on the temp variable that appears and select 'Copy object'.");
    }
  };

  useEffect(() => {
    setShowBottomWidget(false);
    setTimeout(() => setShowBottomWidget(true), 36);
  }, [cityName]);

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        gap: '22px',
        alignItems: 'center',
        paddingTop: '28px',
        ...transitionStyle
      }}
    >
      <div style={{ opacity: showBottomWidget ? 1 : 0, ...transitionStyle }}>
        <BottomWidget cityName={cityName} onCityNameChange={handleCityNameChange} />
      </div>
      {hasCoordinates && coordinates && (
        <div style={{ opacity: 1, ...transitionStyle }}>
          <h3>H3 Indexes</h3>
          <ul>
            {h3Indexes.map((index, idx) => (
              <li key={idx}>{`H3:${idx} : ${index}`}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ParentComponent;