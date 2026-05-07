import { Router } from "express";
import { autocompleteAddress, geocodeAddress, getPlaceDetails, reverseGeocode } from "../controllers/geocodeController";

const geocodeRoutes = Router();

// Autocompletado de direcciones
geocodeRoutes.get("/autocomplete", autocompleteAddress);

// Obtener detalles de un lugar (MÁS PRECISO)
geocodeRoutes.get("/place-details", getPlaceDetails);

// Reverse Geocoding: coordenadas → dirección (para selector de mapa)
geocodeRoutes.get("/reverse", reverseGeocode);

// Geocodificar dirección (fallback)
geocodeRoutes.get("/geocode", geocodeAddress);

export default geocodeRoutes;
