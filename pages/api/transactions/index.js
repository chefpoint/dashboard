import database from '../../../services/database';
import Transaction from '../../../models/Transaction';
import { requireAuth } from '@clerk/nextjs/api';

/* * */
/* GET ALL TRANSACTIONS */
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

  // 2. Try to fetch all transactions from the database
  try {
    const allTransactions = await Transaction.find({}).sort({ createdAt: -1 }).limit(1000);
    await res.status(200).send(allTransactions);
    return;
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'Cannot fetch transactions.' });
    return;
  }
});
