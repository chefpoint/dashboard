import { requireAuth } from '@clerk/nextjs/api';
import database from '../../../services/database';
import Model from '../../../models/CheckingAccount';
import Schema from '../../../schemas/CheckingAccount';

/* * */
/* CREATE CHECKINGACCOUNT */
/* Explanation needed. */
/* * */

export default requireAuth(async (req, res) => {
  //

  // 0. Refuse request if not POST
  if (req.method != 'POST') {
    await res.setHeader('Allow', ['POST']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  // 1. Parse request body into JSON
  try {
    req.body = JSON.parse(req.body);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'JSON parse error.' });
  }

  // 2. Validate req.body against schema
  try {
    req.body = Schema.cast(req.body);
  } catch (err) {
    console.log(err);
    return await res.status(400).json({ message: JSON.parse(err.message)[0].message });
  }

  // 3. Try to connect to the database
  try {
    await database.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Database connection error.' });
  }

  // 4. Try to create a new CheckingAccount
  try {
    const createdCheckingAccount = await Model(req.body).save();
    return await res.status(200).json(createdCheckingAccount);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot create this CheckingAccount.' });
  }
});
