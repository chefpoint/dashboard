import { requireAuth } from '@clerk/nextjs/api';
import database from '../../../services/database';
import Discount from '../../../models/Discount';

/* * */
/* GET ALL DISCOUNTS */
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

  // 2. Try to fetch all Discounts from the database
  try {
    const allDiscounts = await Discount.find({});
    await res.status(200).send(allDiscounts.sort((a, b) => a.title - b.title));
    return;
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'Cannot fetch Discounts.' });
    return;
  }
});
