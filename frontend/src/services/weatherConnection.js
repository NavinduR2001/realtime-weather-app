import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Store the getAccessToken function
let getAccessToken = null;

export const setAuthToken = (getTokenFunction) => {
  getAccessToken = getTokenFunction;
  
};


// Request interceptor (for adding auth token)
apiClient.interceptors.request.use(
  async (config) => {
    if (getAccessToken) {
      try {
        const token = await getAccessToken();
        config.headers.Authorization = `Bearer ${token}`;
        console.log(token);
        
      } catch (error) {
        console.error('Error getting access token:', error);
      }
    }
    return config;
    
  },
  (error) => Promise.reject(error)
);

// Response interceptor (for error handling)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message;
    console.error('API Error:', message);
    return Promise.reject(new Error(message));
  }
);

//Fetch api's

export const getCityIds = async () => {
  const response = await apiClient.get('/weather/cities');
  return response.data;
};
 
export const getWeather = async (cityId) => {
  const response = await apiClient.get(`/weather/${cityId}`);
  return response.data;
};

export const getAllWeather = async () => {
  const response = await apiClient.get('/weather/all');
  return response.data;
};

export default apiClient;