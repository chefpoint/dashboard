import { requireAuth } from '@clerk/nextjs/api';
import database from '../../../../services/database';
import Model from '../../../../models/Product';
import Schema from '../../../../schemas/Product';

/* * */
/* EDIT PRODUCT */
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

  // 1. Parse request body into JSON
  try {
    req.body = JSON.parse(req.body);
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'JSON parse error.' });
    return;
  }

  // 2. Validate req.body against schema
  try {
    req.body = Schema.parse(req.body);
  } catch (err) {
    console.log(err);
    await res.status(400).json({ message: JSON.parse(err.message)[0].message });
    return;
  }

  // 3. Try to connect to the database
  try {
    await database.connect();
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'Database connection error.' });
    return;
  }

  // 4. Try to update the correct Product
  try {
    const editedProduct = await Model.findOneAndUpdate({ _id: req.query._id }, req.body, { new: true }); // Return the edited document
    if (!editedProduct) return await res.status(404).json({ message: `Product with _id: ${req.query._id} not found.` });
    return await res.status(200).json(editedProduct);
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'Cannot update this Product.' });
    return;
  }
});
