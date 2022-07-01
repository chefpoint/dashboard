import database from '../../../../services/database';
import Device from '../../../../models/Device';
import { requireAuth } from '@clerk/nextjs/api';

/* * */
/* EDIT CHECKING ACCOUNT */
/* Explanation needed. */
/* * */

export default requireAuth(async (req, res) => {
  //

  // 0. Refuse request if not PUT
  if (req.method != 'PUT') {
    await res.setHeader('Allow', ['PUT']);
    await res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    return;
  }

  // 1. Parse request body into JSON
  try {
    req.body = JSON.parse(req.body);
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'JSON parse error.' });
    return;
  }

  // 2. Try to connect to the database
  try {
    await database.connect();
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'Database connection error.' });
    return;
  }

  // 3. Configure the device
  let formattedDevice = {};
  try {
    // Title
    formattedDevice.title = req.body.title || 'untitled';
    // Location
    formattedDevice.location = req.body.location?.value || null;
    // Layout
    formattedDevice.layout = req.body.layout?.value || null;
    // Users
    formattedDevice.users = [];
    for (const item of req.body.users) formattedDevice.users.push(item.value);
    // Discounts
    formattedDevice.discounts = [];
    for (const item of req.body.discounts) formattedDevice.discounts.push(item.value);
    // Checking Accounts
    formattedDevice.checking_accounts = [];
    for (const item of req.body.checking_accounts) formattedDevice.checking_accounts.push(item.value);
    //
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'Failed to format req.body.' });
    return;
  }

  // 4. Try to update the correct Device
  try {
    const editedDevice = await Device.findOneAndUpdate({ _id: req.query._id }, formattedDevice, { new: true }); // Return the edited document
    if (!editedDevice) return await res.status(404).json({ message: `Device with _id: ${req.query._id} not found.` });
    return await res.status(200).json(editedDevice);
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'Cannot update this Device.' });
    return;
  }
});
