import database from '../../../../services/database';
import Customer from '../../../../models/Customer';
import { requireAuth } from '@clerk/nextjs/api';

/* * */
/* DUPLICATE CUSTOMER */
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

  // 2. Try to fetch the correct Customer from the database
  //    and create a new copy of it without the unique fields.
  try {
    const foundCustomer = await Customer.findOne({ _id: req.query._id }).lean();
    if (!foundCustomer) return await res.status(404).json({ message: `Customer with _id: ${req.query._id} not found.` });
    // Delete properties that must be unique to each Customer
    delete foundCustomer._id;
    delete foundCustomer.reference;
    // Save as a new document
    const duplicatedCustomer = await new Customer(foundCustomer).save();
    console.log(duplicatedCustomer);
    await res.status(201).json(duplicatedCustomer);
    return;
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'Cannot fetch this Customer.' });
    return;
  }
});
