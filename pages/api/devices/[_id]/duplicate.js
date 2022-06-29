import database from '../../../../services/database';
import Device from '../../../../models/Device';
import generator from '../../../../services/generator';

export default async function duplicateDevice(req, res) {
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

  // 2. Try to fetch the correct Device from the database
  //    and create a new copy of it without the unique fields.
  try {
    const foundDevice = await Device.findOne({ _id: req.query._id }).lean();
    if (!foundDevice) return await res.status(404).json({ message: `Device with _id: ${req.query._id} not found.` });
    // Delete properties that must be unique to each Device
    delete foundDevice._id;
    // Generate a new unique code for the new Device
    let deviceCodeIsNotUnique = true;
    while (deviceCodeIsNotUnique) {
      foundDevice.code = generator(6);
      deviceCodeIsNotUnique = await Device.exists({ code: foundDevice.code });
    }
    // Save as a new document
    const duplicatedDevice = await new Device(foundDevice).save();
    await res.status(201).json(duplicatedDevice);
    return;
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'Cannot fetch this Device.' });
    return;
  }
}
