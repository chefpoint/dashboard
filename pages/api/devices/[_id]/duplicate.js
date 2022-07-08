import { requireAuth } from '@clerk/nextjs/api';
import database from '../../../../services/database';
import Model from '../../../../models/Device';
import generator from '../../../../services/generator';

/* * */
/* DUPLICATE DEVICE */
/* Explanation needed. */
/* * */

export default requireAuth(async (req, res) => {
  //

  // 0. Refuse request if not GET
  if (req.method != 'GET') {
    await res.setHeader('Allow', ['GET']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  // 1. Try to connect to the database
  try {
    await database.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Database connection error.' });
  }

  // 2. Try to fetch the correct Device from the database
  //    and create a new copy of it without the unique fields.
  try {
    const foundDevice = await Model.findOne({ _id: req.query._id }).lean();
    if (!foundDevice) return await res.status(404).json({ message: `Device with _id: ${req.query._id} not found.` });
    // Delete properties that must be unique to each Device
    delete foundDevice._id;
    // Change the Device title to indicate this is a copy
    foundDevice.title += ' (cópia)';
    // Generate a new unique code for the new Device
    let deviceCodeIsNotUnique = true;
    while (deviceCodeIsNotUnique) {
      foundDevice.code = generator(6);
      deviceCodeIsNotUnique = await Model.exists({ code: foundDevice.code });
    }
    // Save as a new document
    const duplicatedDevice = await new Model(foundDevice).save();
    return await res.status(201).json(duplicatedDevice);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot fetch this Device.' });
  }
});
