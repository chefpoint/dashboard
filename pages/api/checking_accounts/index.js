import { requireAuth } from '@clerk/nextjs/api';
import database from '../../../services/database';
import Model from '../../../models/CheckingAccount';

/* * */
/* GET ALL CHECKING ACCOUNTS */
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

  // 2. Try to fetch all Checking Accounts from the database
  try {
    const allCheckingAccounts = await Model.find({});
    await res.status(200).send(allCheckingAccounts);
    return;
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'Cannot fetch Checking Accounts.' });
    return;
  }
});
