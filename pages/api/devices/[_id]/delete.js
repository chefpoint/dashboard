import database from '../../../../services/database';
import Device from '../../../../models/Device';
import { requireAuth } from '@clerk/nextjs/api';

/* * */
/* DELETE DEVICE */
/* Explanation needed. */
/* * */

export default requireAuth(async (req, res) => {
  //

  // 0. Refuse request if not DELETE
  if (req.method != 'DELETE') {
    await res.setHeader('Allow', ['DELETE']);
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

  // 2. Try to update the correct Device
  try {
    const deletedDevice = await Device.findOneAndDelete({ _id: req.query._id }); // Return the deleted document
    if (!deletedDevice) return await res.status(404).json({ message: `Device with _id: ${req.query._id} not found.` });
    return await res.status(200).send(deletedDevice);
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'Cannot delete this Device.' });
    return;
  }
});
