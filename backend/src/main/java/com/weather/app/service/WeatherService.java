package com.weather.app.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.weather.app.model.City;
import com.weather.app.model.CityList;
import com.weather.app.model.WeatherResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class WeatherService {

    @Value("${openweather.api.key}")
    private String apiKey;

    private final WebClient webClient;
    private final ObjectMapper objectMapper;
    private List<City> cities;

    public WeatherService(WebClient.Builder webClientBuilder, ObjectMapper objectMapper) {
        this.webClient = webClientBuilder.build();
        this.objectMapper = objectMapper;
        loadCities();
    }

    private void loadCities() {
        try {
            ClassPathResource resource = new ClassPathResource("cities.json");
            CityList cityList = objectMapper.readValue(resource.getInputStream(), CityList.class);
            this.cities = cityList.getList();
            log.info("Loaded {} cities from cities.json", cities.size());
        } catch (IOException e) {
            log.error("Error loading cities.json", e);
            this.cities = List.of();
        }
    }

    // Get all city IDs
    public List<Long> getCityIds() {
        return cities.stream()
                .map(city -> Long.parseLong(city.getCityCode()))
                .collect(Collectors.toList());
    }

    public List<City> getAllCities() {
        return cities;
    }

    public List<City> searchCities(String query) {
        String searchQuery = query.toLowerCase().trim();
        return cities.stream()
                .filter(city -> city.getCityName().toLowerCase().contains(searchQuery))
                .toList();
    }

    public Optional<City> findCityByName(String cityName) {
        return cities.stream()
                .filter(city -> city.getCityName().equalsIgnoreCase(cityName.trim()))
                .findFirst();
    }

    // Get weather by city ID
    @Cacheable(value = "weatherCache", key = "#cityId")
    public WeatherResponse getWeatherByCityId(Long cityId) {
        log.info("Fetching weather data from API for city ID: {}", cityId);

        try {
            return webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .scheme("https")
                            .host("api.openweathermap.org")
                            .path("/data/2.5/weather")
                            .queryParam("id", cityId)
                            .queryParam("appid", apiKey)
                            .queryParam("units", "metric")
                            .build())
                    .retrieve()
                    .bodyToMono(WeatherResponse.class)
                    .block();
        } catch (Exception e) {
            log.error("Error fetching weather for city ID {}: {}", cityId, e.getMessage());
            throw new RuntimeException("Failed to fetch weather data", e);
        }
    }

    @Cacheable(value = "weatherCache", key = "#cityCode")
    public WeatherResponse getWeatherByCityCode(String cityCode) {
        log.info("Fetching weather data from API for city code: {}", cityCode);

        try {
            return webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .scheme("https")
                            .host("api.openweathermap.org")
                            .path("/data/2.5/weather")
                            .queryParam("id", cityCode)
                            .queryParam("appid", apiKey)
                            .queryParam("units", "metric")
                            .build())
                    .retrieve()
                    .bodyToMono(WeatherResponse.class)
                    .block();
        } catch (Exception e) {
            log.error("Error fetching weather for city code {}: {}", cityCode, e.getMessage());
            throw new RuntimeException("Failed to fetch weather data", e);
        }
    }

    public WeatherResponse getWeatherByCityName(String cityName) {
        City city = findCityByName(cityName)
                .orElseThrow(() -> new RuntimeException("City not found: " + cityName));

        return getWeatherByCityCode(city.getCityCode());
    }

    // Get weather for all cities
    public List<WeatherResponse> getAllWeather() {
        log.info("Fetching weather for all cities");
        return cities.stream()
                .map(city -> getWeatherByCityCode(city.getCityCode()))
                .collect(Collectors.toList());
    }
}