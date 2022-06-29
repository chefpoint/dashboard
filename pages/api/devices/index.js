import database from '../../../services/database';
import Device from '../../../models/Device';
import Location from '../../../models/Location';
import User from '../../../models/User';
import Layout from '../../../models/Layout';
import Product from '../../../models/Product';
import Discount from '../../../models/Discount';
import CheckingAccount from '../../../models/CheckingAccount';
import { requireAuth } from '@clerk/nextjs/api';

/* * */
/* GET ALL DEVICES */
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

  // 2. Try to fetch all devices from the database
  try {
    const allDevices = await Device.find({})
      .populate({ path: 'location' })
      .populate({ path: 'users' })
      .populate({ path: 'layout', populate: { path: 'folders.slots.product' } })
      .populate({ path: 'discounts' })
      .populate({ path: 'checking_accounts' });
    await res.status(200).send(allDevices);
    return;
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'Cannot fetch devices.' });
    return;
  }
});
