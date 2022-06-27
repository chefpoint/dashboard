import database from '../../../../services/database';
import Device from '../../../../models/Device';
import Location from '../../../../models/Location';
import User from '../../../../models/User';
import Layout from '../../../../models/Layout';
import Product from '../../../../models/Product';
import Discount from '../../../../models/Discount';
import CheckingAccount from '../../../../models/CheckingAccount';

export default async function devices(req, res) {
  switch (req.method) {
    case 'GET':
      return await getDevice(req, res);
    case 'PUT':
      return await putDevice(req, res);
    case 'DELETE':
      return await deleteDevice(req, res);
    default:
      await res.setHeader('Allow', ['GET', 'PUT']);
      await res.status(405).end(`Method ${req.method} Not Allowed`);
      return;
  }
}

/* * */
/* REST: GET */
async function getDevice(req, res) {
  //
  // 1. Try to connect to the database
  try {
    await database.connect();
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'Database connection error.' });
    return;
  }

  // 2. Try to fetch the correct Device from the database
  try {
    const foundDevice = await Device.findOne({ _id: req.query._id })
      .populate({ path: 'location' })
      .populate({ path: 'users' })
      .populate({ path: 'layout', populate: { path: 'folders.slots.product' } })
      .populate({ path: 'discounts' })
      .populate({ path: 'checking_accounts' });
    if (!foundDevice) return await res.status(404).json({ message: `Device with _id: ${req.query._id} not found.` });
    await res.status(200).send(foundDevice);
    return;
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'Cannot fetch this Device.' });
    return;
  }
}

/* * */
/* REST: PUT */
async function putDevice(req, res) {
  //
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
    const updatedDevice = await Device.findOneAndUpdate({ _id: req.query._id }, JSON.parse(req.body), { new: true }); // Return the updated document
    if (!updatedDevice) return await res.status(404).json({ message: `Device with _id: ${req.query._id} not found.` });
    return await res.status(200).send(updatedDevice);
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'Cannot update this Device.' });
    return;
  }
}

/* * */
/* REST: DELETE */
async function deleteDevice(req, res) {
  //
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
}
