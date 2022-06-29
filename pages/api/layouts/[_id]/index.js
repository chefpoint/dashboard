import { requireAuth } from '@clerk/nextjs/api';
import database from '../../../../services/database';
import Layout from '../../../../models/Layout';

/* * */
/* GET LAYOUT BY ID */
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
  try {
    const foundLayout = await Layout.findOne({ _id: req.query._id }).populate({ path: 'folders.slots.product' });
    if (!foundLayout) return await res.status(404).json({ message: `Layout with _id: ${req.query._id} not found.` });
    await res.status(200).json(foundLayout);
    return;
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'Cannot fetch this Layout.' });
    return;
  }
});
