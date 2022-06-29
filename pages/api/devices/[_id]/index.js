import { requireAuth } from '@clerk/nextjs/api';
import database from '../../../../services/database';
import Device from '../../../../models/Device';
import Location from '../../../../models/Location';
import User from '../../../../models/User';
import Layout from '../../../../models/Layout';
import Product from '../../../../models/Product';
import Discount from '../../../../models/Discount';
import CheckingAccount from '../../../../models/CheckingAccount';

/* * */
/* GET DEVICE BY ID */
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

  // 2. Try to fetch the correct Device from the database
  try {
    const foundDevice = await Device.findOne({ _id: req.query._id })
      .populate({ path: 'location' })
      .populate({ path: 'users' })
      .populate({ path: 'layout', populate: { path: 'folders.slots.product' } })
      .populate({ path: 'discounts' })
      .populate({ path: 'checking_accounts' });
    if (!foundDevice) return await res.status(404).json({ message: `Device with _id: ${req.query._id} not found.` });
    await res.status(200).json(foundDevice);
    return;
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'Cannot fetch this Device.' });
    return;
  }
});
