import { z } from 'zod';

// REST Countries API Response Schemas
const countrySchema = z.object({
  name: z.object({
    common: z.string(),
    official: z.string(),
    nativeName: z.record(z.object({
      official: z.string(),
      common: z.string(),
    })).optional(),
  }),
  cca2: z.string(), // ISO 3166-1 alpha-2
  cca3: z.string(), // ISO 3166-1 alpha-3
  ccn3: z.string().optional(), // ISO 3166-1 numeric
  cca4: z.string().optional(),
  cioc: z.string().optional(),
  independent: z.boolean().optional(),
  status: z.string(),
  unMember: z.boolean(),
  currencies: z.record(z.object({
    name: z.string(),
    symbol: z.string(),
  })).optional(),
  idd: z.object({
    root: z.string(),
    suffixes: z.array(z.string()),
  }).optional(),
  capital: z.array(z.string()).optional(),
  altSpellings: z.array(z.string()),
  region: z.string(),
  subregion: z.string().optional(),
  languages: z.record(z.string()).optional(),
  translations: z.record(z.object({
    official: z.string(),
    common: z.string(),
  })).optional(),
  latlng: z.array(z.number()).length(2), // [latitude, longitude]
  landlocked: z.boolean(),
  borders: z.array(z.string()).optional(),
  area: z.number(),
  demonyms: z.record(z.object({
    f: z.string(),
    m: z.string(),
  })).optional(),
  flag: z.string(), // Unicode flag emoji
  maps: z.object({
    googleMaps: z.string(),
    openStreetMaps: z.string(),
  }),
  population: z.number(),
  gini: z.record(z.number()).optional(),
  fifa: z.string().optional(),
  car: z.object({
    signs: z.array(z.string()),
    side: z.string(),
  }).optional(),
  timezones: z.array(z.string()),
  continents: z.array(z.string()),
  flags: z.object({
    png: z.string(),
    svg: z.string(),
    alt: z.string().optional(),
  }),
  coatOfArms: z.object({
    png: z.string().optional(),
    svg: z.string().optional(),
  }).optional(),
  startOfWeek: z.string(),
  capitalInfo: z.object({
    latlng: z.array(z.number()).length(2).optional(),
  }).optional(),
  postalCode: z.object({
    format: z.string(),
    regex: z.string(),
  }).optional(),
});

export interface Country {
  name: {
    common: string;
    official: string;
    nativeNames?: Record<string, { official: string; common: string }> | undefined;
  };
  codes: {
    cca2: string; // ISO 3166-1 alpha-2
    cca3: string; // ISO 3166-1 alpha-3
    ccn3?: string | undefined; // ISO 3166-1 numeric
    cioc?: string | undefined;
  };
  status: string;
  unMember: boolean;
  currencies?: Record<string, { name: string; symbol: string }> | undefined;
  phoneCodes?: {
    root: string;
    suffixes: string[];
  } | undefined;
  capital?: string[] | undefined;
  altSpellings: string[];
  region: string;
  subregion?: string | undefined;
  languages?: Record<string, string> | undefined;
  location: {
    lat: number;
    lng: number;
  };
  landlocked: boolean;
  borders?: string[] | undefined;
  area: number; // in square kilometers
  population: number;
  timezones: string[];
  continents: string[];
  flag: string; // Unicode flag emoji
  flags: {
    png: string;
    svg: string;
    alt?: string | undefined;
  };
  maps: {
    googleMaps: string;
    openStreetMaps: string;
  };
  startOfWeek: string;
  capitalLocation?: {
    lat: number;
    lng: number;
  } | undefined;
  postalCode?: {
    format: string;
    regex: string;
  } | undefined;
}

export class CountriesService {
  private baseUrl = 'https://restcountries.com/v3.1';

  async getAllCountries(): Promise<Country[]> {
    try {
      const response = await fetch(`${this.baseUrl}/all`);
      
      if (!response.ok) {
        throw new Error(`Countries API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const validatedData = z.array(countrySchema).parse(data);

      return validatedData.map(country => this.transformCountry(country));
    } catch (error) {
      console.error('Error fetching all countries:', error);
      return [];
    }
  }

  async getCountryByCode(code: string): Promise<Country | null> {
    try {
      const response = await fetch(`${this.baseUrl}/alpha/${code}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Countries API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const validatedData = countrySchema.parse(data);

      return this.transformCountry(validatedData);
    } catch (error) {
      console.error('Error fetching country by code:', error);
      return null;
    }
  }

  async getCountriesByRegion(region: string): Promise<Country[]> {
    try {
      const response = await fetch(`${this.baseUrl}/region/${region}`);
      
      if (!response.ok) {
        throw new Error(`Countries API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const validatedData = z.array(countrySchema).parse(data);

      return validatedData.map(country => this.transformCountry(country));
    } catch (error) {
      console.error('Error fetching countries by region:', error);
      return [];
    }
  }

  async getCountriesBySubregion(subregion: string): Promise<Country[]> {
    try {
      const response = await fetch(`${this.baseUrl}/subregion/${subregion}`);
      
      if (!response.ok) {
        throw new Error(`Countries API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const validatedData = z.array(countrySchema).parse(data);

      return validatedData.map(country => this.transformCountry(country));
    } catch (error) {
      console.error('Error fetching countries by subregion:', error);
      return [];
    }
  }

  async searchCountries(query: string): Promise<Country[]> {
    try {
      const response = await fetch(`${this.baseUrl}/name/${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return [];
        }
        throw new Error(`Countries API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const validatedData = z.array(countrySchema).parse(data);

      return validatedData.map(country => this.transformCountry(country));
    } catch (error) {
      console.error('Error searching countries:', error);
      return [];
    }
  }

  async getCountriesByCapital(capital: string): Promise<Country[]> {
    try {
      const response = await fetch(`${this.baseUrl}/capital/${encodeURIComponent(capital)}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return [];
        }
        throw new Error(`Countries API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const validatedData = z.array(countrySchema).parse(data);

      return validatedData.map(country => this.transformCountry(country));
    } catch (error) {
      console.error('Error fetching countries by capital:', error);
      return [];
    }
  }

  async getCountriesByLanguage(language: string): Promise<Country[]> {
    try {
      const response = await fetch(`${this.baseUrl}/lang/${encodeURIComponent(language)}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return [];
        }
        throw new Error(`Countries API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const validatedData = z.array(countrySchema).parse(data);

      return validatedData.map(country => this.transformCountry(country));
    } catch (error) {
      console.error('Error fetching countries by language:', error);
      return [];
    }
  }

  async getCountriesByCurrency(currency: string): Promise<Country[]> {
    try {
      const response = await fetch(`${this.baseUrl}/currency/${encodeURIComponent(currency)}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return [];
        }
        throw new Error(`Countries API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const validatedData = z.array(countrySchema).parse(data);

      return validatedData.map(country => this.transformCountry(country));
    } catch (error) {
      console.error('Error fetching countries by currency:', error);
      return [];
    }
  }

  private transformCountry(country: z.infer<typeof countrySchema>): Country {
    return {
      name: {
        common: country.name.common,
        official: country.name.official,
        ...(country.name.nativeName && { nativeNames: country.name.nativeName }),
      },
      codes: {
        cca2: country.cca2,
        cca3: country.cca3,
        ...(country.ccn3 && { ccn3: country.ccn3 }),
        ...(country.cioc && { cioc: country.cioc }),
      },
      status: country.status,
      unMember: country.unMember,
      currencies: country.currencies,
      phoneCodes: country.idd,
      capital: country.capital,
      altSpellings: country.altSpellings,
      region: country.region,
      subregion: country.subregion,
      languages: country.languages,
      location: {
        lat: country.latlng[0] || 0,
        lng: country.latlng[1] || 0,
      },
      landlocked: country.landlocked,
      borders: country.borders,
      area: country.area,
      population: country.population,
      timezones: country.timezones,
      continents: country.continents,
      flag: country.flag,
      flags: {
        png: country.flags.png,
        svg: country.flags.svg,
        ...(country.flags.alt && { alt: country.flags.alt }),
      },
      maps: country.maps,
      startOfWeek: country.startOfWeek,
      capitalLocation: country.capitalInfo?.latlng ? {
        lat: country.capitalInfo.latlng[0] || 0,
        lng: country.capitalInfo.latlng[1] || 0,
      } : undefined,
      postalCode: country.postalCode,
    };
  }

  // Helper methods for common use cases
  async getPopularDestinations(): Promise<Country[]> {
    // Get some popular travel destinations
    const popularCodes = ['US', 'FR', 'IT', 'ES', 'GB', 'DE', 'JP', 'AU', 'CA', 'BR', 'IN', 'TH', 'MX', 'GR', 'PT'];
    
    const countries = await Promise.all(
      popularCodes.map(code => this.getCountryByCode(code))
    );

    return countries.filter((country): country is Country => country !== null);
  }

  async getCountriesByContinent(continent: string): Promise<Country[]> {
    const allCountries = await this.getAllCountries();
    return allCountries.filter(country => 
      country.continents.some(c => c.toLowerCase() === continent.toLowerCase())
    );
  }

  async getCountriesWithVisaFreeAccess(countryCode: string): Promise<Country[]> {
    // This would require additional API or data source
    // For now, return empty array as this requires specialized visa data
    console.warn('Visa information not available through REST Countries API');
    return [];
  }
}
