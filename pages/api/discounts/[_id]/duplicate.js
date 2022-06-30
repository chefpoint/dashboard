import { requireAuth } from '@clerk/nextjs/api';
import database from '../../../../services/database';
import Discount from '../../../../models/Discount';

/* * */
/* DUPLICATE DISCOUNT */
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
  //    and create a new copy of it without the unique fields.
  try {
    const foundDiscount = await Discount.findOne({ _id: req.query._id }).lean();
    if (!foundDiscount) return await res.status(404).json({ message: `Discount with _id: ${req.query._id} not found.` });
    // Delete properties that must be unique to each Discount
    delete foundDiscount._id;
    // Save as a new document
    const duplicatedDiscount = await new Discount(foundDiscount).save();
    await res.status(201).json(duplicatedDiscount);
    return;
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'Cannot duplicate this Discount.' });
    return;
  }
});
