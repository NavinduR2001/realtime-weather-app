import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import WeatherList from './components/WeatherList';
import LoginButton from './components/Auth/LoginButton';
import LogoutButton from './components/Auth/LogoutButton';
import { setAuthToken } from './services/weatherConnection';
import { MainBG, Logo } from './assets/assets';
import Footer from './components/Footer';

function App() {
    const { isAuthenticated,isLoading, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      setAuthToken(getAccessTokenSilently);
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  if (isLoading) {
  return (
    <div 
      className="min-h-screen flex items-center justify-center" 
      style={{ 
        backgroundImage: `url(${MainBG})`, 
        backgroundPosition: 'top', 
        backgroundSize: 'contain',  
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#1e2027',
      }}
    />
  );
}

  if (!isAuthenticated) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center" 
        style={{ 
          backgroundImage: `url(${MainBG})`, 
          backgroundPosition: 'top', 
          backgroundSize: 'contain',  
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#1e2027'
        }}
      >
        <div className="text-center">
          <div className="flex flex-col items-center gap-4 mb-8">
            <img src={Logo} alt="Weather App" className="w-24 h-auto" />
            <h1 className="text-5xl font-bold text-white max-md:text-3xl">Weather App</h1>
          </div>
          <p className="text-white text-xl mb-8 max-md:text-base">Please log in to view weather data</p>
          <LoginButton />
        </div>
      </div>
    );
  }

  return (
    < div 
      className="min-h-screen" 
      style={{ 
        backgroundImage: `url(${MainBG})`, 
        backgroundPosition: 'top', 
        backgroundSize: 'contain',  
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#1e2027'
      }}
    >
      {/* Header with Profile and Logout */}
      <div className="container mx-auto px-4 pt-6">
        <div className="flex justify-end items-center gap-4">
          <LogoutButton />
        </div>
      </div>

      <WeatherList />
      <Footer />

    </div>
  );
}

export default App;