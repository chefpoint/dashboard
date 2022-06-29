import database from '../../../../services/database';
import Customer from '../../../../models/Customer';
import { requireAuth } from '@clerk/nextjs/api';

/* * */
/* EDIT CUSTOMER */
/* Explanation needed. */
/* * */

export default requireAuth(async (req, res) => {
  //

  // 0. Refuse request if not PUT
  if (req.method != 'PUT') {
    await res.setHeader('Allow', ['PUT']);
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

  // 2. Try to update the correct customer
  try {
    const editedCustomer = await Customer.findOneAndUpdate({ _id: req.query._id }, JSON.parse(req.body), { new: true }); // Return the edited document
    if (!editedCustomer) return await res.status(404).json({ message: `Customer with _id: ${req.query._id} not found.` });
    return await res.status(200).json(editedCustomer);
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'Cannot update this customer.' });
    return;
  }
});
