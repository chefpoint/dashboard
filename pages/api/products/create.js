import { requireAuth } from '@clerk/nextjs/api';
import database from '../../../services/database';
import Model from '../../../models/Product';
import Schema from '../../../schemas/Product';

/* * */
/* CREATE PRODUCT */
/* Explanation needed. */
/* * */

export default requireAuth(async (req, res) => {
  //

  // 0. Refuse request if not POST
  if (req.method != 'POST') {
    await res.setHeader('Allow', ['POST']);
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

  // 4. Try to create a new Product
  try {
    const createdProduct = await Model(req.body).save();
    return await res.status(200).json(createdProduct);
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'Cannot create this Product.' });
    return;
  }
});
