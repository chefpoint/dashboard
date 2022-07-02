import { requireAuth } from '@clerk/nextjs/api';
import database from '../../../../services/database';
import User from '../../../../models/User';

/* * */
/* EDIT User */
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

  // 1. Try to parse req.body into JSON
  try {
    req.body = await JSON.parse(req.body);
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

  // 3. Check for uniqueness
  try {
    // The values that need to be unique are ['pwd'].
    // Reasons: The User only needs to input the password when logging into the POS,
    // otherwise the system will choose one of the duplicates at random.
    if (req.body.pwd) {
      const foundPwd = await User.findOne({ pwd: req.body.pwd });
      if (foundPwd._id != req.query._id) throw new Error('Já existe um colaborador com a mesma password.');
    }
  } catch (err) {
    console.log(err);
    await res.status(409).json({ message: err.message });
    return;
  }

  // 4. Try to update the document with req.body
  try {
    const editedUser = await User.findOneAndUpdate({ _id: req.query._id }, req.body, {
      new: true, // Return the updated document
    });
    await res.status(200).json(editedUser);
    return;
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'Could not edit User.' });
    return;
  }
});
