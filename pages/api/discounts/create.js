import database from '../../../services/database';
import Discount from '../../../models/Discount';
import { requireAuth } from '@clerk/nextjs/api';

/* * */
/* CREATE DISCOUNT */
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

  // 3. Configure the Discount
  let formattedDiscount = {};
  try {
    // Title
    formattedDiscount.title = req.body.title || 'untitled';
    // Subtitle
    formattedDiscount.subtitle = req.body.subtitle || null;
    // Description
    formattedDiscount.description = req.body.description || null;
    // Amount
    formattedDiscount.amount = req.body.amount || null;
    // Rules
    formattedDiscount.rules = req.body.rules;
    // Style
    formattedDiscount.style = {
      fill: req.body.style.fill || null,
      border: req.body.style.border || null,
      text: req.body.style.text || null,
    };
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'Failed to format req.body.' });
    return;
  }

  // 4. Try to create a new Discount
  try {
    const createdDiscount = await Discount(formattedDiscount).save(); // Return the created document
    return await res.status(201).json(createdDiscount);
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'Cannot create this Discount.' });
    return;
  }
});
