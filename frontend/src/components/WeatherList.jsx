import React, { useState, useEffect } from 'react';
import { getAllWeather } from '../services/weatherConnection';
import WeatherCard from './WeatherCard';
import { Logo } from '../assets/assets';


const WeatherList = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

   // Define colors for each city by ID
  const cityColors = {
    0: 'from-blue-400 to-blue-500',      
    1: 'from-purple-500 to-purple-600',  
    2: 'from-green-400 to-green-500',    
    3: 'from-orange-400 to-orange-500',  
    4: 'from-red-400 to-red-500',        
    5: 'from-cyan-400 to-cyan-500',      
    6: 'from-pink-400 to-pink-500',
    7: 'from-yellow-400 to-yellow-500',
  };

  useEffect(() => {
    fetchWeatherData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchWeatherData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getAllWeather();
       const dataWithColors = data.map((weather, index) => ({
        ...weather,
        colorScheme: cityColors[index] || 'from-blue-400 to-blue-500'
      }));
      setWeatherData(dataWithColors);
      setLastFetch(new Date());
      
    } catch (err) {
      setError('Failed to fetch weather data. Please try again later.');
      console.error('Error fetching weather:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCity = (cityId) => {
    setWeatherData(prev => prev.filter(w => w.id !== cityId));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[100vh] ">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading Weather App</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="bg-red-100 border border-red-400 text-red-700 px-8 py-6 rounded-lg">
          <p className="text-xl font-semibold">{error}</p>
          <button 
            onClick={fetchWeatherData}
            className="mt-4 bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-15 mx-auto px-4 pb-8">
      
      <div className="max-w-2xl mx-auto mb-15">
        <div className="flex flex-row items-center justify-center mb-15 gap-4 max-md:flex-col">
            <img src={Logo} alt="Weather App" className="w-20 h-auto "/>
            <h1 className="text-4xl font-bold text-white text-center ">Whether App</h1>
        </div>
        <div className="flex gap-5 ">
          <input 
            type="text"
            placeholder="Enter a city"
            className="flex-1 px-6 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled
          />
          <button 
            className="px-8 py-3 bg-purple-600 text-white  rounded-lg hover:bg-purple-700 transition font-semibold cursor-not-allowed max-sm:text-[12px] max-sm:px-6 max-sm:py-1"
            disabled
          >
            Add City
          </button>
        </div>
      </div>
      
      
      
       {/* Weather Cards Responsive 2 columns on desktop and 1 column on mobile */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
        {weatherData.map((weather) => (
          <WeatherCard 
            key={weather.id} 
            weather={weather}
            onRemove={handleRemoveCity}
          />
        ))}
      </div>
      
      {weatherData.length === 0 && (
        <div className="text-center text-white mt-12">
          <p className="text-xl">No cities to display</p>
        </div>
      )}

      
    </div>
  );
};

export default WeatherList;