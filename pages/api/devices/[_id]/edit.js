import { requireAuth } from '@clerk/nextjs/api';
import database from '../../../../services/database';
import Model from '../../../../models/Device';
import Schema from '../../../../schemas/Device';

/* * */
/* EDIT DEVICE */
/* Explanation needed. */
/* * */

export default requireAuth(async (req, res) => {
  //

  // 0. Refuse request if not PUT
  if (req.method != 'PUT') {
    await res.setHeader('Allow', ['PUT']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  // 1. Parse request body into JSON
  try {
    req.body = JSON.parse(req.body);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'JSON parse error.' });
  }

  // 2. Validate req.body against schema
  try {
    req.body = Schema.parse(req.body);
  } catch (err) {
    console.log(err);
    return await res.status(400).json({ message: JSON.parse(err.message)[0].message });
  }

  // 3. Try to connect to the database
  try {
    await database.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Database connection error.' });
  }

  // 4. Try to update the correct Device
  try {
    const editedDevice = await Model.findOneAndUpdate({ _id: req.query._id }, req.body, { new: true }); // Return the edited document
    if (!editedDevice) return await res.status(404).json({ message: `Device with _id: ${req.query._id} not found.` });
    return await res.status(200).json(editedDevice);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot update this Device.' });
  }
});
