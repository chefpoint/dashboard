import { requireAuth } from '@clerk/nextjs/api';
import database from '../../../../services/database';
import Layout from '../../../../models/Layout';

/* * */
/* DUPLICATE Layout */
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

  // 2. Try to fetch the correct Layout from the database
  //    and create a new copy of it without the unique fields.
  try {
    const foundLayout = await Layout.findOne({ _id: req.query._id }).lean();
    if (!foundLayout) return await res.status(404).json({ message: `Layout with _id: ${req.query._id} not found.` });
    // Delete properties that must be unique to each Layout
    delete foundLayout._id;
    // Save as a new document
    const duplicatedLayout = await new Layout(foundLayout).save();
    await res.status(201).json(duplicatedLayout);
    return;
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'Cannot duplicate this Layout.' });
    return;
  }
});
