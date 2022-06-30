import { requireAuth } from '@clerk/nextjs/api';
import database from '../../../../services/database';
import Discount from '../../../../models/Discount';

/* * */
/* DELETE DISCOUNT */
/* Explanation needed. */
/* * */

export default requireAuth(async (req, res) => {
  //

  // 0. Refuse request if not DELETE
  if (req.method != 'DELETE') {
    await res.setHeader('Allow', ['DELETE']);
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

  // 2. Try to update the correct Discount
  try {
    const deletedDiscount = await Discount.findOneAndDelete({ _id: req.query._id }); // Return the deleted document
    if (!deletedDiscount) return await res.status(404).json({ message: `Discount with _id: ${req.query._id} not found.` });
    return await res.status(200).send(deletedDiscount);
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'Cannot delete this Discount.' });
    return;
  }
});
