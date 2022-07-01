import database from '../../../../services/database';
import CheckingAccount from '../../../../models/CheckingAccount';
import { requireAuth } from '@clerk/nextjs/api';

/* * */
/* EDIT CHECKING ACCOUNT */
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
    const editedCheckingAccount = await CheckingAccount.findOneAndUpdate({ _id: req.query._id }, req.body, { new: true }); // Return the edited document
    if (!editedCheckingAccount) return await res.status(404).json({ message: `CheckingAccount with _id: ${req.query._id} not found.` });
    return await res.status(200).json(editedCheckingAccount);
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'Cannot update this CheckingAccount.' });
    return;
  }
});
