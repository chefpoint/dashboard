import database from '../../../services/database';
import CheckingAccount from '../../../models/CheckingAccount';
import { requireAuth } from '@clerk/nextjs/api';

/* * */
/* CREATE CHECKING ACCOUNT */
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

  // 2. Try to connect to the database
  try {
    await database.connect();
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'Database connection error.' });
    return;
  }

  // 3. Try to update the correct CheckingAccount
  try {
    const createdCheckingAccount = await CheckingAccount(req.body).save();
    return await res.status(200).json(createdCheckingAccount);
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'Cannot create this CheckingAccount.' });
    return;
  }
});
