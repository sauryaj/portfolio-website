class WeatherWidget {
    constructor() {
        this.init();
    }

    async init() {
        this.createWidgetElement();
        this.retryCount = 0;
        this.maxRetries = 2;
        await this.loadWeatherWithRetry();
    }

    async loadWeatherWithRetry() {
        try {
            const location = await this.fetchLocation();
            if (location) {
                const weather = await this.fetchWeather(location.latitude, location.longitude);
                this.render(location.city, weather);
            } else {
                this.handleError();
            }
        } catch (error) {
            console.error('Weather widget error:', error);
            
            // Retry logic
            if (this.retryCount < this.maxRetries) {
                this.retryCount++;
                console.log(`Retrying weather fetch (${this.retryCount}/${this.maxRetries})...`);
                setTimeout(() => this.loadWeatherWithRetry(), 2000); // Retry after 2 seconds
            } else {
                this.handleError();
            }
        }
    }

    createWidgetElement() {
        this.widget = document.createElement('div');
        this.widget.className = 'weather-widget visible'; // Make visible immediately
        this.widget.innerHTML = '<div class="weather-loading"></div>';
        document.body.appendChild(this.widget);
    }

    async fetchLocation() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
            
            const response = await fetch('https://ipapi.co/json/', {
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            
            if (!response.ok) throw new Error('Location fetch failed');
            return await response.json();
        } catch (error) {
            if (error.name === 'AbortError') {
                console.warn('Location fetch timed out, using fallback...');
            } else {
                console.warn('Location fetch failed, using fallback...', error);
            }
            // Fallback to Wellington, New Zealand
            return {
                city: 'Wellington',
                latitude: -41.2866,
                longitude: 174.7756
            };
        }
    }

    async fetchWeather(lat, lon) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
        
        try {
            const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`, {
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            
            if (!response.ok) throw new Error('Weather fetch failed');
            const data = await response.json();
            return data.current_weather;
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error('Weather API request timed out');
            }
            throw error;
        }
    }

    getWeatherIcon(code) {
        // WMO Weather interpretation codes (WW)
        // https://open-meteo.com/en/docs
        const icons = {
            0: '☀️', // Clear sky
            1: '🌤️', // Mainly clear
            2: '⛅', // Partly cloudy
            3: '☁️', // Overcast
            45: '🌫️', // Fog
            48: '🌫️', // Depositing rime fog
            51: '🌦️', // Drizzle: Light
            53: '🌦️', // Drizzle: Moderate
            55: '🌦️', // Drizzle: Dense intensity
            61: '🌧️', // Rain: Slight
            63: '🌧️', // Rain: Moderate
            65: '🌧️', // Rain: Heavy
            71: '❄️', // Snow fall: Slight
            73: '❄️', // Snow fall: Moderate
            75: '❄️', // Snow fall: Heavy
            77: '❄️', // Snow grains
            80: '🌦️', // Rain showers: Slight
            81: '🌦️', // Rain showers: Moderate
            82: '🌦️', // Rain showers: Violent
            85: '🌨️', // Snow showers slight
            86: '🌨️', // Snow showers heavy
            95: '⛈️', // Thunderstorm: Slight or moderate
            96: '⛈️', // Thunderstorm with slight hail
            99: '⛈️', // Thunderstorm with heavy hail
        };
        return icons[code] || '🌡️';
    }

    render(city, weather) {
        const icon = this.getWeatherIcon(weather.weathercode);
        const temp = Math.round(weather.temperature);
        
        this.widget.innerHTML = `
            <div class="weather-content">
                <span class="weather-icon">${icon}</span>
                <span class="weather-temp">${temp}°C</span>
                <span class="weather-city">${city}</span>
            </div>
        `;
        
        // Add fade-in animation
        this.widget.classList.add('visible');
    }

    handleError() {
        this.widget.innerHTML = `
            <div class="weather-content error">
                <span class="weather-icon">⚠️</span>
                <span class="weather-city">Unavailable</span>
            </div>
        `;
        this.widget.classList.add('visible');
    }
}

// Initialize
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WeatherWidget;
} else {
    window.WeatherWidget = WeatherWidget;
}
