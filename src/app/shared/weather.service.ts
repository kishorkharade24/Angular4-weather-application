import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class WeatherService {

  locationURL: String = '';
  weatherURL: String = '';

  constructor(private http: Http) {
  }

  getCityCode(location: string) {
    const url = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20geo.places%20where%20text%3D%22Place%20'
      + location + '%22&format=json';

    return this.http.get(url).map(res => res.json());
  }

  getCityWeather(woeid: number) {
    const statement = 'select * from weather.forecast where woeid=' + woeid;
    const url = 'https://query.yahooapis.com/v1/public/yql?format=json&q=' +
      statement;

    return this.http.get(url).map(res => res.json());
  }

  getWeatherIconClass(weatherCode: number) {
    // Weather codes: https://developer.yahoo.com/weather/documentation.html#codes
    switch (weatherCode) {
      case 25: // cold
      case 32: // sunny
      case 33: // fair (night)
      case 34: // fair (day)
      case 36: // hot
      case 3200: // not available
        return 'clear-day';
      case 0: // tornado
      case 1: // tropical storm
      case 2: // hurricane
      case 6: // mixed rain and sleet
      case 8: // freezing drizzle
      case 9: // drizzle
      case 10: // freezing rain
      case 11: // showers
      case 12: // showers
      case 17: // hail
      case 35: // mixed rain and hail
      case 40: // scattered showers
        return 'rain';
      case 3: // severe thunderstorms
      case 4: // thunderstorms
      case 37: // isolated thunderstorms
      case 38: // scattered thunderstorms
      case 39: // scattered thunderstorms (not a typo)
      case 45: // thundershowers
      case 47: // isolated thundershowers
        return 'thunderstorms';
      case 5: // mixed rain and snow
      case 7: // mixed snow and sleet
      case 13: // snow flurries
      case 14: // light snow showers
      case 16: // snow
      case 18: // sleet
      case 41: // heavy snow
      case 42: // scattered snow showers
      case 43: // heavy snow
      case 46: // snow showers
        return 'snow';
      case 15: // blowing snow
      case 19: // dust
      case 20: // foggy
      case 21: // haze
      case 22: // smoky
        return 'fog';
      case 24: // windy
      case 23: // blustery
        return 'windy';
      case 26: // cloudy
      case 27: // mostly cloudy (night)
      case 28: // mostly cloudy (day)
      case 31: // clear (night)
        return 'cloudy';
      case 29: // partly cloudy (night)
      case 30: // partly cloudy (day)
      case 44: // partly cloudy
        return 'partly-cloudy-day';
    }
  }
}
