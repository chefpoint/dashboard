import { requireAuth } from '@clerk/nextjs/api';
import database from '../../../../services/database';
import Location from '../../../../models/Location';

/* * */
/* DUPLICATE LOCATION */
/* Explanation needed. */
/* * */

export default requireAuth(async (req, res) => {
  //

  // 0. Refuse request if not GET
  if (req.method != 'GET') {
    await res.setHeader('Allow', ['GET']);
    await res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    return;
  }

  // 1. Try to connect to the database
  try {
    await database.connect();
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'Database connection error.' });
    return;
  }

  // 2. Try to fetch the correct Location from the database
  //    and create a new copy of it without the unique fields.
  try {
    const foundLocation = await Location.findOne({ _id: req.query._id }).lean();
    if (!foundLocation) return await res.status(404).json({ message: `Location with _id: ${req.query._id} not found.` });
    // Delete properties that must be unique to each Location
    delete foundLocation._id;
    // Save as a new document
    const duplicatedLocation = await new Location(foundLocation).save();
    await res.status(201).json(duplicatedLocation);
    return;
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'Cannot duplicate this Location.' });
    return;
  }
});
