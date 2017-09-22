import { Component } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { WeatherService } from './shared/weather.service';
import {City} from './models/city.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  woeid: number;
  Math: any;
  cityList: Array<City> = [];
  daysOfWeek: Array<String> = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  showPlaces: boolean = false;
  location: string;

  initialWeatherForecast = {
    key: '2459115',
    label: 'New York, NY',
    created: '2016-07-22T01:00:00Z',
    channel: {
      astronomy: {
        sunrise: "5:43 am",
        sunset: "8:21 pm"
      },
      item: {
        condition: {
          text: "Windy",
          date: "Thu, 21 Jul 2016 09:00 PM EDT",
          temp: 56,
          code: 24
        },
        forecast: [
          {code: 44, high: 86, low: 70},
          {code: 44, high: 94, low: 73},
          {code: 4, high: 95, low: 78},
          {code: 24, high: 75, low: 89},
          {code: 24, high: 89, low: 77},
          {code: 44, high: 92, low: 79},
          {code: 44, high: 89, low: 77}
        ]
      },
      atmosphere: {
        humidity: 56
      },
      wind: {
        speed: 25,
        direction: 195
      }
    }
  };

  constructor(private http: Http,
              public weatherService: WeatherService) {
    this.Math = Math;
  }

  getWeatherIconClass(weatherCode: string) {
    const weatherCode1 = +weatherCode;
    return this.weatherService.getWeatherIconClass(weatherCode1);
  }

  getDay(index) {
    const today = (new Date()).getDay();
    return this.daysOfWeek[(index + today) % 7];
  }

  showPlace() {
    if (this.location !== '' && this.location !== undefined) {
      return this.weatherService.getCityCode(this.location)
        .subscribe(weather => this.handleSuccessResponse(weather),
          error => this.handleErrorResponse(error));
    }
  }

  handleSuccessResponse(weather: any) {
    const list = weather.query.results.place;
    this.cityList = [];

    if ( list instanceof Array) {
      list.forEach(data => {
        const city = new City();

        city.woeid = data.woeid;
        city.name = data.name;
        city.country = data.country.content;
        city.countryCode = data.country.code;
        city.countryWOEID = data.country.woeid;
        city.latitude = data.centroid.latitude;
        city.longitude = data.centroid.longitude;
        city.timezone = data.timezone.content;
        city.state = data.admin1.content;

        this.cityList.push(city);
      });
      this.showPlaces = true;
    } else {
      const city = new City();

      city.woeid = list.woeid;
      city.name = list.name;
      city.country = list.country.content;
      city.countryCode = list.country.code;
      city.countryWOEID = list.country.woeid;
      city.latitude = list.centroid.latitude;
      city.longitude = list.centroid.longitude;
      city.timezone = list.timezone.content;
      city.state = list.admin1.content;

      this.cityList.push(city);
      this.showPlaces = true;
    }
  }

  handleErrorResponse(error: any) {
    this.showPlaces = false;
  }

  getCityWeather(woeid: number) {
    this.weatherService.getCityWeather(woeid)
      .subscribe(weather => {
        this.initialWeatherForecast.key = woeid.toString();
        this.initialWeatherForecast.label = weather.query.results.channel.location.city
          + '( ' + weather.query.results.channel.location.region + ' ), ' + weather.query.results.channel.location.country;

        this.initialWeatherForecast.created = weather.query.created;
        this.initialWeatherForecast.channel = weather.query.results.channel;
      },
        error => console.error(JSON.stringify(error)));
  }
}
