import database from '../../../services/database';
import User from '../../../models/User';
import { requireAuth } from '@clerk/nextjs/api';

/* * */
/* CREATE NEW USER */
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

  // 1. Try to save a new document with req.body
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
    // The only value that needs to, and can be, unique is 'pwd'.
    // Reasons: For 'contact_email', there can be two Users with different name but same email,
    // like a company that has several employees and needs to receive the invoices
    // in the same accounting email. For NIF, the same happens: there can be two people
    // that want to share the same NIF, but receive invoices in different emails.
    // This might be expanded in the future, if emails are necessary for account creation.
    if (req.body.pwd) {
      const existsPwd = await User.exists({ pwd: req.body.pwd });
      if (existsPwd) throw new Error('Já existe um colaborador com a mesma password.');
    }
  } catch (err) {
    console.log(err);
    await res.status(409).json({ message: err.message });
    return;
  }

  // 4. Try to save a new document with req.body
  try {
    const newUser = await User(req.body).save();
    await res.status(201).json(newUser);
    return;
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'User creation error.' });
    return;
  }
});
