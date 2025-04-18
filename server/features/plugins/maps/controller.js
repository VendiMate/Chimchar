import { db } from '../../../../db/index.js';
import { FindClosestPoint } from './helper.js';
export async function getCities(request, h) {
  try {
    const cities = await db('location_cities').select('name', 'city_id');
    return h.response(cities).code(200);
  } catch (error) {
    console.error(error);
    return h.response({ message: 'Error getting cities' }).code(500);
  }
}

export async function getCoordinates(request, h) {
  try {
    const coordinates = await db('vending_machine_locations').select('*');
    return h.response(coordinates).code(200);
  } catch (error) {
    console.error(error);
    return h.response({ message: 'Error getting coordinates' }).code(500);
  }
}

export async function findClosestVendingMachine(request, h) {
  const { lat, long } = request.payload;
  console.log(lat, long);
  let coordinates;
  try {
    coordinates = await db('vending_machine_locations').select('*');
  } catch (error) {
    console.error(error);
    return h.response({ message: 'Error getting coordinates' }).code(500);
  }

  const { closestLocation, closestDistance } = await FindClosestPoint(
    lat,
    long,
    coordinates,
  );
  console.log('Closest Location: ', closestLocation);
  return h.response({ closestLocation, closestDistance }).code(200);
}
