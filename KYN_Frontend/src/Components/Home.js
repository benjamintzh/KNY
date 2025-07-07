import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext';

function Home() {
  const { user } = useAuth();
  const [feed, setFeed] = useState([]);
  const [error, setError] = useState('');
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState('');
  const [loadingWeather, setLoadingWeather] = useState(false);

  // Fetch community feed
  useEffect(() => {
    axios
      .get('http://localhost:8080/api/community/feed', { withCredentials: true })
      .then((response) => {
        setFeed(response.data);
        setError('');
      })
      .catch((err) => {
        console.error('Failed to load community feed:', err);
        setError('Failed to load community feed');
      });
  }, []);

  // Fetch user's location and weather data
  useEffect(() => {
    console.log('API Key:', process.env.REACT_APP_GOOGLE_API_KEY);
    if (!process.env.REACT_APP_GOOGLE_API_KEY) {
      setWeatherError('API key is missing. Please check environment configuration.');
      setLoadingWeather(false);
      return;
    }
    if (navigator.geolocation) {
      setLoadingWeather(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await axios.get(
              `https://weather.googleapis.com/v1/currentConditions:lookup?key=${process.env.REACT_APP_GOOGLE_API_KEY}&location.latitude=${latitude}&location.longitude=${longitude}`
            );
            setWeather(response.data);
            setWeatherError('');
          } catch (err) {
            console.error('Failed to fetch weather:', err);
            setWeatherError(
              err.response?.data?.message ||
                'Unable to fetch weather data for your location'
            );
          } finally {
            setLoadingWeather(false);
          }
        },
        (err) => {
          console.error('Geolocation error:', err);
          setWeatherError(
            'Unable to detect your location. Please enable location services.'
          );
          setLoadingWeather(false);
        }
      );
    } else {
      setWeatherError('Geolocation is not supported by your browser.');
      setLoadingWeather(false);
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to Know Your Neighborhood</h1>
      <p className="text-lg mb-4">
        {user ? (
          `Hello, ${user.name || user.email}! Explore the community forums below.`
        ) : (
          <>
            <Link to="/login" className="text-blue-500 hover:underline">
              Log in
            </Link>{' '}
            or{' '}
            <Link to="/register" className="text-blue-500 hover:underline">
              register
            </Link>{' '}
            to join the community!
          </>
        )}
      </p>

      {/* Weather Section */}
      <h2 className="text-2xl font-semibold mb-4">Current Weather</h2>
      {loadingWeather && <p className="text-gray-600">Loading weather...</p>}
      {weatherError && <p className="text-red-500 mb-4">{weatherError}</p>}
      {weather && !weatherError && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold">
            Weather at Your Location
          </h3>
          <p className="text-gray-600">
            Condition: {weather.weatherCondition?.description?.text || 'N/A'}
          </p>
          <p className="text-gray-600">
            Temperature: {weather.temperature?.degrees || 'N/A'}°C
          </p>
          <p className="text-gray-600">
            Feels Like: {weather.feelsLikeTemperature?.degrees || 'N/A'}°C
          </p>
          <p className="text-gray-600">
            Humidity: {weather.relativeHumidity || 'N/A'}%
          </p>
          <p className="text-gray-600">
            Wind: {weather.wind?.speed?.value || 'N/A'} km/h{' '}
            {weather.wind?.direction?.cardinal || ''}
          </p>
          {weather.weatherCondition?.iconBaseUri && (
            <img
              src={`${weather.weatherCondition.iconBaseUri}.png`}
              alt="Weather Icon"
              className="mt-2 w-12 h-12"
            />
          )}
        </div>
      )}

      {/* Community Feed Section */}
      <h2 className="text-2xl font-semibold mb-4">Community Feed</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {feed.length > 0 ? (
        <div className="space-y-4">
          {feed.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
              <p className="text-sm text-gray-500">Posted by: {item.createdBy}</p>
              <Link
                to={`/forums/${item.id}`}
                className="text-blue-500 hover:underline"
              >
                View Posts
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No recent activity.</p>
      )}
    </div>
  );
}

export default Home;