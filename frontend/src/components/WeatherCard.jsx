import React, { useState } from 'react';
import { CardBG, Logo, MainBG, WindIcon} from '../assets/assets';
import Footer from './Footer';

const WeatherCard = ({ weather, onRemove }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  //openweathermap icon url
  const iconUrl = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;

  const cardColor = weather.colorScheme || 'from-blue-400 to-blue-500';


  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = () => {
    const date = new Date();
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      month: 'short',
      day: 'numeric'
    });
  };

    if (isExpanded) {
    // Detailed View (Full Screen)
    return (
      <div className="fixed  bg-[#1e2027] min-h-screen inset-0 z-50 overflow-auto" style={{ backgroundImage: `url(${MainBG})`, backgroundPosition: 'top', backgroundSize: 'contain',  backgroundRepeat: 'no-repeat' }}>
        <div className="min-h-screen flex flex-col justify-between pb-0 pt-8">
        <div className="container mx-auto px-4 py-7 max-w-5xl">
          <div className="flex flex-row items-center justify-center mb-25 gap-4 max-md:flex-col">
                      <img src={Logo} alt="Weather App" className="w-20 h-auto "/>
                      <h1 className="text-4xl font-bold text-white text-center ">Whether App</h1>
                  </div>

          <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 rounded-2xl shadow-2xl overflow-hidden">
            {/* Header Section */}
            <div className={`bg-gradient-to-br ${cardColor} p-8 relative`}>
              <button 
                onClick={() => setIsExpanded(false)}
                className="absolute top-4 left-4 text-white text-2xl hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center transition"
              >
                ←
              </button>
              
              <div className="text-center text-white">
                <h2 className="text-4xl font-bold max-md:text-2xl">{weather.name}, {weather.sys.country}</h2>
                <p className="text-lg mt-2 opacity-90">{formatDate()}</p>
                
                <div className="flex items-center justify-center gap-8 mt-8 max-md:flex-col max-md:gap-4">
                  <div className="text-center border-r border-white/30 pr-8 max-md:border-r-0 max-md:border-b max-md:pb-4 max-md:pr-0">
                    <img 
                      src={iconUrl} 
                      alt={weather.weather[0].description}
                      className="w-32 h-32 mx-auto"
                    />
                    <p className="text-xl capitalize mt-2">{weather.weather[0].description}</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-8xl font-bold max-md:text-6xl">{Math.round(weather.main.temp)}°c</p>
                    <div className="mt-4 text-lg">
                      <p>Temp Min: {Math.round(weather.main.temp_min)}°c</p>
                      <p>Temp Max: {Math.round(weather.main.temp_max)}°c</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Details Section */}
            <div className="bg-[#383b47] p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
                <div className="space-y-2 max-md:flex max-md:items-center max-md:justify-center max-md:gap-4">
                  <p className="text-gray-400">Pressure: <span className="text-white font-semibold">{weather.main.pressure}hPa</span></p>
                  <p className="text-gray-400">Humidity: <span className="text-white font-semibold">{weather.main.humidity}%</span></p>
                  <p className="text-gray-400">Visibility: <span className="text-white font-semibold">{(weather.visibility / 1000).toFixed(1)}km</span></p>
                </div>
                
                <div className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-l md:border-r border-gray-600 pt-4 max-md:flex-row max-md:gap-5 max-md:items-center max-md:justify-center md:pt-0">
                  <img src={WindIcon} className='w-10 h-auto mb-2' alt="Wind" />
                  <p className="text-xl font-semibold">{weather.wind.speed}m/s {weather.wind.deg} Degree</p>
                </div>
                
                <div className="text-left md:text-right space-y-2 border-t md:border-t-0 border-gray-600 pt-4 md:pt-0 flex flex-col max-md:flex-row max-md:gap-5 max-md:items-center max-md:justify-center">
                  <p className="text-gray-400">Sunrise: <span className="text-white font-semibold">{formatTime(weather.sys.sunrise)}</span></p>
                  <p className="text-gray-400">Sunset: <span className="text-white font-semibold">{formatTime(weather.sys.sunset)}</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer className="absolute bottom-0 w-full"/>
      </div>
      </div>
    );
  }

  // Card Grid View
  return (
    <div className="flex flex-col h-full">
     <div className={`bg-gradient-to-br ${cardColor} rounded-t-2xl shadow-md overflow-hidden`}>
      <div 
        className="px-20 py-10 cursor-pointer hover:opacity-90 transition relative max-md:px-5 max-md:py-5" style={{ backgroundImage: `url(${CardBG})`, backgroundPosition: 'center', backgroundSize: 'contain',  backgroundRepeat: 'no-repeat', backgroundBlendMode: 'overlay' }}
        onClick={() => setIsExpanded(true)}
      >
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (onRemove) onRemove(weather.id);
          }}
          className="absolute top-3 right-3 text-white hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition text-xl font-bold"
        >
          ×
        </button>
        
        <div className="text-white">
          
          
          <div className="flex items-center justify-between mt-6">
            <div className="flex flex-col items-start gap-1">
              <h3 className="text-3xl max-md:text-2xl font-bold">{weather.name}, {weather.sys.country}</h3>
             <p className="text-sm opacity-90 mt-1">{formatDate()}</p>
             <div className="flex flex-row items-center justify-left mt-4 max-md:flex-col max-md:items-start gap-2 max-md:gap-0">
              <img 
                src={iconUrl} 
                alt={weather.weather[0].description}
                className="w-16 h-16"
              />
              <p className="capitalize text-sm">{weather.weather[0].description}</p>
              </div>
            </div>
            
            <div className="text-right flex flex-col justify-space-between items-right  gap-12 max-md:gap-20 ">
              <p className="text-6xl max-md:text-4xl font-bold">{Math.round(weather.main.temp)}°c</p>
              <div>
              <p className="text-sm mt-2">Temp Min: {Math.round(weather.main.temp_min)}°c</p>
              <p className="text-sm">Temp Max: {Math.round(weather.main.temp_max)}°c</p>
            </div>
            </div>

          </div>
        </div>

      </div>
      </div>
      
      <div className="bg-[#383b47] rounded-b-2xl p-4 text-white text-xs flex-grow">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1 max-xs:space-y-0 ">
            <p className="text-gray-400">Pressure: <span className="text-white">{weather.main.pressure}hPa</span></p>
            <p className="text-gray-400">Humidity: <span className="text-white">{weather.main.humidity}%</span></p>
            <p className="text-gray-400">Visibility: <span className="text-white">{(weather.visibility / 1000).toFixed(1)}km</span></p>
          </div>

          <div className="flex flex-col items-center justify-center gap-2  border-l border-r border-gray-100  px-2 max-xs:px-0 max-xs:text-[8px] ">
            <div>
              <img src={WindIcon} className='w-5 h-auto'></img>
              </div>
              <div className="flex flex-row gap-1 justify-center items-center max-md:flex-col max-md:items-center">
              <div className="text-white">{weather.wind.speed}m/s </div>
              <div>{weather.wind.deg} Degree</div>
              </div>
            </div>
          
          <div className="flex flex-col text-right space-y-1 justify-center max-xs:space-y-0 ">
            <p className="text-gray-400">Sunrise: <span className="text-white">{formatTime(weather.sys.sunrise)}</span></p>
            <p className="text-gray-400">Sunset: <span className="text-white">{formatTime(weather.sys.sunset)}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;