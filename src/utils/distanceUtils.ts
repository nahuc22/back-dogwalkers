/**
 * Utilidades para cálculo de distancias geográficas
 */

/**
 * Calcula la distancia entre dos puntos GPS usando la fórmula de Haversine
 * @param lat1 - Latitud del punto 1
 * @param lon1 - Longitud del punto 1
 * @param lat2 - Latitud del punto 2
 * @param lon2 - Longitud del punto 2
 * @returns Distancia en kilómetros
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  // Radio de la Tierra en kilómetros
  const R = 6371;

  // Convertir grados a radianes
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Distancia en kilómetros
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Redondear a 1 decimal
}

/**
 * Convierte grados a radianes
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Formatea la distancia para mostrar
 * @param km - Distancia en kilómetros
 * @returns String formateado (ej: "2.5 km", "850 m")
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    const meters = Math.round(km * 1000);
    return `${meters} m`;
  }
  return `${km.toFixed(1)} km`;
}

/**
 * Verifica si un punto está dentro de un radio
 * @param lat1 - Latitud del centro
 * @param lon1 - Longitud del centro
 * @param lat2 - Latitud del punto a verificar
 * @param lon2 - Longitud del punto a verificar
 * @param radiusKm - Radio en kilómetros
 * @returns true si está dentro del radio
 */
export function isWithinRadius(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  radiusKm: number
): boolean {
  const distance = calculateDistance(lat1, lon1, lat2, lon2);
  return distance <= radiusKm;
}

/**
 * Ordena un array de items por distancia a un punto
 * @param items - Array de items con latitude y longitude
 * @param userLat - Latitud del usuario
 * @param userLon - Longitud del usuario
 * @returns Array ordenado por distancia (más cercano primero)
 */
export function sortByDistance<T extends { latitude: any; longitude: any }>(
  items: T[],
  userLat: number,
  userLon: number
): (T & { distance: number })[] {
  return items
    .map(item => {
      const lat = parseFloat(item.latitude);
      const lon = parseFloat(item.longitude);
      
      if (isNaN(lat) || isNaN(lon)) {
        return { ...item, distance: Infinity };
      }

      const distance = calculateDistance(userLat, userLon, lat, lon);
      return { ...item, distance };
    })
    .sort((a, b) => a.distance - b.distance);
}

/**
 * Filtra items dentro de un radio específico
 * @param items - Array de items con latitude y longitude
 * @param userLat - Latitud del usuario
 * @param userLon - Longitud del usuario
 * @param radiusKm - Radio en kilómetros
 * @returns Array filtrado con items dentro del radio
 */
export function filterByRadius<T extends { latitude: any; longitude: any }>(
  items: T[],
  userLat: number,
  userLon: number,
  radiusKm: number
): (T & { distance: number })[] {
  return sortByDistance(items, userLat, userLon).filter(
    item => item.distance <= radiusKm
  );
}
