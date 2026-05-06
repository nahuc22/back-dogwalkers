/**
 * Utilidades para manejo de ubicaciones en Argentina
 */

export const ARGENTINE_PROVINCES = [
  'Buenos Aires',
  'Catamarca',
  'Chaco',
  'Chubut',
  'Córdoba',
  'Corrientes',
  'Entre Ríos',
  'Formosa',
  'Jujuy',
  'La Pampa',
  'La Rioja',
  'Mendoza',
  'Misiones',
  'Neuquén',
  'Río Negro',
  'Salta',
  'San Juan',
  'San Luis',
  'Santa Cruz',
  'Santa Fe',
  'Santiago del Estero',
  'Tierra del Fuego',
  'Tucumán',
];

/**
 * Extraer provincia desde un string de ubicación
 * @param location - String de ubicación (ej: "San Miguel de Tucumán, Tucumán")
 * @returns Nombre de la provincia o null
 */
export function extractProvince(location: string | null | undefined): string | null {
  if (!location) return null;
  
  const locationLower = location.toLowerCase();
  
  for (const province of ARGENTINE_PROVINCES) {
    if (locationLower.includes(province.toLowerCase())) {
      return province;
    }
  }
  
  return null;
}

/**
 * Extraer ciudad desde un string de ubicación
 * @param location - String de ubicación (ej: "San Miguel de Tucumán, Tucumán")
 * @returns Nombre de la ciudad o null
 */
export function extractCity(location: string | null | undefined): string | null {
  if (!location) return null;
  
  // Si tiene formato "Ciudad, Provincia", extraer la ciudad
  const parts = location.split(',').map(p => p.trim());
  if (parts.length >= 2) {
    return parts[0];
  }
  
  // Si no tiene coma, podría ser solo la ciudad o provincia
  return location.trim();
}

/**
 * Parsear ubicación completa en sus componentes
 * @param location - String de ubicación
 * @returns Objeto con provincia, ciudad y ubicación completa
 */
export function parseLocation(location: string | null | undefined) {
  if (!location) {
    return {
      location: null,
      province: null,
      city: null,
    };
  }
  
  const province = extractProvince(location);
  const city = extractCity(location);
  
  return {
    location: location.trim(),
    province,
    city,
  };
}

/**
 * Formatear ubicación para mostrar
 * @param city - Ciudad
 * @param province - Provincia
 * @returns String formateado "Ciudad, Provincia"
 */
export function formatLocation(city?: string | null, province?: string | null): string {
  if (city && province) {
    return `${city}, ${province}`;
  }
  if (city) {
    return city;
  }
  if (province) {
    return province;
  }
  return '';
}
