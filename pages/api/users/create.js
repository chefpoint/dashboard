import { requireAuth } from '@clerk/nextjs/api';
import database from '../../../services/database';
import Model from '../../../models/User';
import Schema from '../../../schemas/User';

/* * */
/* CREATE USER */
/* Explanation needed. */
/* * */

export default requireAuth(async (req, res) => {
  //

  // 0. Refuse request if not POST
  if (req.method != 'POST') {
    await res.setHeader('Allow', ['POST']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  // 1. Try to save a new document with req.body
  try {
    req.body = await JSON.parse(req.body);
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

  // 4. Check for uniqueness
  try {
    // The values that need to be unique are ['pwd'].
    // Reason: The User only needs to input the password when logging into the POS.
    if (req.body.pwd) {
      const existsPwd = await Model.exists({ pwd: req.body.pwd });
      if (existsPwd) throw new Error('This password is already in use. Please choose another one.');
    }
  } catch (err) {
    console.log(err);
    return await res.status(409).json({ message: err.message });
  }

  // 5. Try to save a new document with req.body
  try {
    const newUser = await Model(req.body).save();
    return await res.status(201).json(newUser);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot create this User.' });
  }
});
