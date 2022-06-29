import { requireAuth } from '@clerk/nextjs/api';
import database from '../../../../services/database';
import Product from '../../../../models/Product';

/* * */
/* GET PRODUCT BY ID */
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

  // 2. Try to fetch the correct Product from the database
  try {
    const foundProduct = await Product.findOne({ _id: req.query._id });
    if (!foundProduct) return await res.status(404).json({ message: `Product with _id: ${req.query._id} not found.` });
    await res.status(200).json(foundProduct);
    return;
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'Cannot fetch this Product.' });
    return;
  }
});
