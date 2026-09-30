import { EGYPT_LOCATIONS, CityLocation, AreaItem } from "./locations.data";

export interface LocationQueryOptions {
  city?: string;
  search?: string;
}

export class LocationService {
  /**
   * Get all cities and their associated areas with optional filtering and search
   */
  async getAllLocations(options: LocationQueryOptions = {}): Promise<CityLocation[]> {
    let result = [...EGYPT_LOCATIONS];

    // Filter by city if specified (matches id, nameAr, or nameEn)
    if (options.city) {
      const cityNormalized = options.city.trim().toLowerCase();
      result = result.filter(
        (c) =>
          c.id.toLowerCase() === cityNormalized ||
          c.nameAr.toLowerCase().includes(cityNormalized) ||
          c.nameEn.toLowerCase().includes(cityNormalized)
      );
    }

    // Search across city names and area names
    if (options.search) {
      const searchNormalized = options.search.trim().toLowerCase();
      result = result
        .map((city) => {
          const isCityMatch =
            city.nameAr.toLowerCase().includes(searchNormalized) ||
            city.nameEn.toLowerCase().includes(searchNormalized) ||
            city.id.toLowerCase().includes(searchNormalized);

          const matchingAreas = city.areas.filter(
            (area) =>
              area.nameAr.toLowerCase().includes(searchNormalized) ||
              area.nameEn.toLowerCase().includes(searchNormalized) ||
              area.id.toLowerCase().includes(searchNormalized)
          );

          if (isCityMatch) {
            // Return whole city with all its areas
            return city;
          }

          if (matchingAreas.length > 0) {
            // Return city with only the matching areas
            return {
              ...city,
              areas: matchingAreas
            };
          }

          return null;
        })
        .filter((city): city is CityLocation => city !== null);
    }

    return result;
  }

  /**
   * Get list of all cities (without full area arrays for lightweight dropdowns)
   */
  async getCities(): Promise<{ id: string; nameAr: string; nameEn: string; areasCount: number }[]> {
    return EGYPT_LOCATIONS.map((c) => ({
      id: c.id,
      nameAr: c.nameAr,
      nameEn: c.nameEn,
      areasCount: c.areas.length
    }));
  }

  /**
   * Get areas for a specific city / governorate
   */
  async getAreasByCity(cityParam: string): Promise<AreaItem[]> {
    const normalized = cityParam.trim().toLowerCase();
    const city = EGYPT_LOCATIONS.find(
      (c) =>
        c.id.toLowerCase() === normalized ||
        c.nameAr.toLowerCase() === normalized ||
        c.nameAr.toLowerCase().includes(normalized) ||
        c.nameEn.toLowerCase() === normalized
    );

    return city ? city.areas : [];
  }
}

export const locationService = new LocationService();
