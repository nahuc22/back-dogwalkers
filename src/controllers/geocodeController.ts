import { handler, HttpError } from "../lib/handler";
import { z } from "zod";
import axios from "axios";

// Autocompletado de direcciones con Google Places
export const autocompleteAddress = handler({
  req: z.object({
    query: z.object({
      input: z.string(),
      location: z.string().optional(),
      radius: z.string().optional(),
    })
  }),
  res: z.any(),
  async handler(req) {
    try {
      const { input, location, radius } = req.query;
      
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
        {
          params: {
            input,
            key: process.env.GOOGLE_MAPS_API_KEY,
            language: 'es',
            components: 'country:ar',
            location: location || '-26.8241,-65.2226',
            radius: radius || '50000',
            strictbounds: false,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Error en autocomplete:', error.response?.data || error.message);
      throw new HttpError(500, 'Error al buscar direcciones');
    }
  },
});

// Obtener detalles de un lugar usando place_id (MÁS PRECISO)
export const getPlaceDetails = handler({
  req: z.object({
    query: z.object({
      place_id: z.string(),
    })
  }),
  res: z.any(),
  async handler(req) {
    try {
      const { place_id } = req.query;
      
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json`,
        {
          params: {
            place_id,
            key: process.env.GOOGLE_MAPS_API_KEY,
            language: 'es',
            fields: 'address_components,formatted_address,geometry,name,place_id',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Error en place details:', error.response?.data || error.message);
      throw new HttpError(500, 'Error al obtener detalles del lugar');
    }
  },
});

// Geocodificar dirección para obtener coordenadas (fallback)
export const geocodeAddress = handler({
  req: z.object({
    query: z.object({
      address: z.string(),
    })
  }),
  res: z.any(),
  async handler(req) {
    try {
      const { address } = req.query;
      
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address,
            key: process.env.GOOGLE_MAPS_API_KEY,
            language: 'es',
            components: 'country:AR',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Error en geocode:', error.response?.data || error.message);
      throw new HttpError(500, 'Error al geocodificar dirección');
    }
  },
});
