import { requireAuth } from '@clerk/nextjs/api';
import database from '../../../../services/database';
import Discount from '../../../../models/Discount';

/* * */
/* GET DISCOUNT BY ID */
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

  // 2. Try to fetch the correct Discount from the database
  try {
    const foundDiscount = await Discount.findOne({ _id: req.query._id });
    if (!foundDiscount) return await res.status(404).json({ message: `Discount with _id: ${req.query._id} not found.` });
    await res.status(200).json(foundDiscount);
    return;
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'Cannot fetch this Discount.' });
    return;
  }
});
