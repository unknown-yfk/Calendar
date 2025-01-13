import { Holiday } from '../types/types';

const API_BASE_URL = 'https://date.nager.at/api/v3';

export interface Country {
  countryCode: string;
  name: string;
}

export interface CountryInfo {
  commonName: string;
  officialName: string;
  countryCode: string;
  region: string;
  borders: string[];
}

export const api = {
  async getAvailableCountries(): Promise<Country[]> {
    const response = await fetch(`${API_BASE_URL}/AvailableCountries`);
    return response.json();
  },

  async getCountryInfo(countryCode: string): Promise<CountryInfo> {
    const response = await fetch(`${API_BASE_URL}/CountryInfo/${countryCode}`);
    return response.json();
  },

  async getPublicHolidays(year: number, countryCode: string): Promise<Holiday[]> {
    const response = await fetch(`${API_BASE_URL}/PublicHolidays/${year}/${countryCode}`);
    return response.json();
  },

  async isTodayPublicHoliday(countryCode: string): Promise<boolean> {
    const response = await fetch(`${API_BASE_URL}/IsTodayPublicHoliday/${countryCode}`);
    return response.status === 200;
  },

  async getNextPublicHolidays(countryCode: string): Promise<Holiday[]> {
    const response = await fetch(`${API_BASE_URL}/NextPublicHolidays/${countryCode}`);
    return response.json();
  },

  async getNextPublicHolidaysWorldwide(): Promise<Holiday[]> {
    const response = await fetch(`${API_BASE_URL}/NextPublicHolidaysWorldwide`);
    return response.json();
  },
};

