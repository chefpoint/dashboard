import database from '../../../../services/database';
import User from '../../../../models/User';
import { requireAuth } from '@clerk/nextjs/api';

/* * */
/* GET USER BY ID */
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

  // 2. Try to fetch the correct User from the database
  try {
    const foundUser = await User.findOne({ _id: req.query._id });
    if (!foundUser) return await res.status(404).json({ message: `User with _id: ${req.query._id} not found.` });
    await res.status(200).json(foundUser);
    return;
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'Cannot fetch this User.' });
    return;
  }
});
