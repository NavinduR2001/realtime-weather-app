package com.weather.app.controller;

import com.weather.app.model.WeatherResponse;
import com.weather.app.service.WeatherService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/weather")
@RequiredArgsConstructor
@Slf4j
public class WeatherController {

    private final WeatherService weatherService;

    @GetMapping("/cities")
    public ResponseEntity<List<Long>> getCityIds() {
        log.info("Fetching all city IDs");
        return ResponseEntity.ok(weatherService.getCityIds());
    }

    @GetMapping("/{cityId}")
    public ResponseEntity<WeatherResponse> getWeather(@PathVariable Long cityId) {
        log.info("Fetching weather for city ID: {}", cityId);

        try {
            WeatherResponse weather = weatherService.getWeatherByCityId(cityId);
            return ResponseEntity.ok(weather);
        } catch (Exception e) {
            log.error("Error fetching weather for city {}: {}", cityId, e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<WeatherResponse>> getAllWeather() {
        log.info("Fetching weather for all cities");

        try {
            List<WeatherResponse> weatherList = weatherService.getAllWeather();
            return ResponseEntity.ok(weatherList);
        } catch (Exception e) {
            log.error("Error fetching all weather: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}