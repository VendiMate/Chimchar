import { db } from '../../../../db/index.js';
export async function getCoordinates(request, h) {
  try {
    const coordinates = await db('location_cities').select('name', 'city_id');

    return h.response(coordinates).code(200);
    return h.response({ message: 'Coordinates' }).code(200);
  } catch (error) {
    console.error(error);
    return h.response({ message: 'Error getting coordinates' }).code(500);
  }
}
